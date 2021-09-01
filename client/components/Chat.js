import Login from './Login';
import Messages from './Messages'
import { auth, db, provider } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';

export default function Chat({ user, users, chatId, currentUser }) {
  const [isOwner, setIsOwner] = useState(false);
  const [userChatRef, setUserChatRef] = useState("");
  const [userInChat, setUserInChat] = useState([]);
  let chatsArray = [];

  // Search the connected user along chats participants
  const getUserChatRef = (user) => {
    if(user) setUserChatRef(db.collection('chats').where('users', 'array-contains', user.email));
  };

  // console.log("users :", users);
  
  const [chatsSnapshot, loading, error] = useCollection(userChatRef);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const owner = "david.chmarzynski@gmail.com";

  const signOut = () => {
    chatsArray = [];
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

  if(chatsSnapshot) {
    chatsSnapshot.docs.forEach(doc => {
      doc.data().users.forEach(user => {
        if(user !== owner) chatsArray.push({user: user, chatId: doc.id});
      })
    });
  }

  // User in chats, owner is enrolled in
  console.log(chatsArray)

  // const showUserInChat = (currentUser) => {
  //   if(chatsSnapshot) {
  //     chatsSnapshot.docs.find((chat) => {
  //       chat.data().users.map((user) => {
  //         if(user !== currentUser && userInChat.length === 0) userInChat.push(user);
  //         if(userInChat.length > 0 && user !== currentUser) userInChat.map(doc => doc !== user && userInChat.push(user));
  //       })
  //     })
  //   }
  //   // chatsSnapshot?.docs.find(chat => chat.data().users.map(user => {if(user !== currentUser) user.push(userInChat)}));
  // };

  // const showUserInChat = (currentUser) => {
  //   chatsSnapshot?.docs.find(chat => {
  //     chat.data().users.map(user => {
  //       if(user !== currentUser) {
  //         if(userInChat.length === 0) {
  //           userInChat.push(user);
  //         } else if(userInChat.length > 0) {
  //           userInChat.forEach(doc => {
  //             console.log("doc :", doc, "user :", user, doc !== user);
  //             // if(toString(doc) !== toString(user)) userInChat.push(user)
  //           })
  //         }
  //       }
  //     })
  //   })
  // }

  // const showUserInChat = (currentUser) => {
  //   if(userInChat.length === 0) {
  //     chatsSnapshot?.docs.find(chat => {
  //       chat.data().users.map(user => {
  //         user !== currentUser && userInChat.push(user);
  //       });
  //     });
  //   }
  // };

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
      createNewChat(owner);
    }
  }

  // Redirect to a specific chat, by his id
  const handleChat = (id) => {
    console.log(id);
  }

  useEffect(() => {
    // Determine if current user === owner
    checkUser(user);
    getUserChatRef(user);
  }, [user]);

  // Start createChat function on mount
  useEffect(() => {
    startChat(user, chatsSnapshot);
    // showUserInChat(user?.email);
  });


  return (
    <div className="chat">
      {user && (
        <button onClick={signOut}>Se Déconnecter</button>
      )}
      {user && user.email !== owner && isChatOpen && (
        <Messages user={user} users={users} chatId={chatId} />
      )}
      {user && user.email === owner && isChatOpen && (
        <h1>Bienvenue David</h1>
      )}
      {user && currentUser.email === owner && chatsArray.map(user => (
        <p key={user.chatId} onClick={() => handleChat(user.chatId)}>{user.user}</p>
      ))}
    </div>
  )
};