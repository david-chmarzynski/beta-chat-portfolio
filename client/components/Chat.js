import Login from './Login';
import Messages from './Messages'
import { auth, db, provider } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';

export default function Chat({ user, users }) {
  const [isOwner, setIsOwner] = useState(false);
  const [userChatRef, setUserChatRef] = useState("");

  // Search the connected user along chats participants
  const getUserChatRef = (user) => {
    if(user) setUserChatRef(db.collection('chats').where('users', 'array-contains', user.email));
  };
  
  const [chatsSnapshot, loading, error] = useCollection(userChatRef);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const owner = "david.chmarzynski@gmail.com";

  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
  };

  const signOut = () => {
    auth.signOut();
    db.collection('users').doc(user.uid).update({
      isOnline: false
    });
  };

  // Determine if connected user is owner
  const checkUser = (user) => {
    if(user && user.email === owner) setIsOwner(true);
    else setIsOwner(false);
  };

  // Determine if current user is already enrolled in a chat
  const doesChatAlreadyExist = (recipientEmail) => (
    !!chatsSnapshot?.docs.find(chat => 
      chat.data().users.find(async user => await user === recipientEmail)?.length > 0
    ));

  // Create a new chat with current user and owner
  const createNewChat = (owner) => {
    // Check if current user !== owner and chat doesn't exist
    if(user !== null && user.email !== owner && !doesChatAlreadyExist(owner)) {
      // Add to DB a new chat document with current user and owner
      db.collection('chats').add({
        users: [user.email, owner]
      });
      setIsChatOpen(true);
      // Open chatbox if current user !== owner and chat does exist
    } else if(user !== null && user.email !== owner && doesChatAlreadyExist(owner)) {
      setIsChatOpen(true);
    }
  };

  const startChat = (user, chatsSnapshot) => {
    if(user && chatsSnapshot) {
      createNewChat(user);
    }
  }

  useEffect(() => {
    // Determine if current user === owner
    checkUser(user);
    getUserChatRef(user);
  }, [user]);

  // Start createChat function on mount
  useEffect(() => {
    startChat(user, chatsSnapshot);
  });


  return (
    <div className="chat">
      {!user && (
        <Login signIn={signIn} />
      )}
      {user && (
        <button onClick={signOut}>Se Déconnecter</button>
      )}
      {user && user.email !== owner && isChatOpen && (
        <Messages user={user} users={users} />
      )}
      {user && user.email === owner && isChatOpen && (
        <h1>Bienvenue David</h1>
      )}
    </div>
  )
};

export async function getServerSideProps(context) {
  // const ref = db.collection("chats").doc()
}