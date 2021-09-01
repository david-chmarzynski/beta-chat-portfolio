import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import firebase from 'firebase/app'
import { useCollection } from 'react-firebase-hooks/firestore';

function MyApp({ Component, pageProps }) {
  const [user, loading, error] = useAuthState(auth);
  const [userChatRef, setUserChatRef] = useState("");
  const [chatsSnapshot] = useCollection(userChatRef);
  // Search the connected user along chats participants
  const getUserChatRef = (user) => {
    if(user) setUserChatRef(db.collection('chats').where('users', 'array-contains', user.email));
  };

  useEffect(() => {
    if(user) {
      db.collection("users").doc(user.uid).set({
        email: user.email,
        id: user.uid,
        username: user.displayName,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL,
        isOnline: true
      }, { merge: true });
    }
    getUserChatRef(user);
    // if(chatsSnapshot !== undefined) {
    //   getUserChatRef(user);
    //   fillUsersInChat(chatsSnapshot);
    // }
  }, [user]);

  // useEffect(() => {
  //       fillUsersInChat(chatsSnapshot);
  //       setChatId(chatsSnapshot?.docs[0]?.id);
  //       console.log(chatId);
  // }, []);

  return <Component {...pageProps} user={user} auth={auth} db={db} userChatRef={userChatRef} chatsSnapshot={chatsSnapshot} />
}

export default MyApp
