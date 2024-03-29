import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { auth, db, provider } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

// IMPORT COMPONENTS
import Chat from '../components/Chat';
import Login from '../components/Login';

export default function Home({ user, auth, db, chatsSnapshot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [chatId, setChatId] = useState("");
  const [users, setUsers] = useState([]);
  let currentUser = undefined;
  const [usersRef, setUsersRef] = useState("");
  const [usersSnapshot] = useCollection(usersRef);

  // Snapshot of currentUser
  currentUser = {...usersSnapshot?.data()};

  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
  };

  // Fill an array of users, enrolled in current chat
  const fillUsersInChat = (chatsSnapshot) => {
    chatsSnapshot?.docs?.map((chat) => {
      setUsers(chat.data().users)
    });
  };

  const handleClick = () => {
    setIsOpen(!isOpen)
    // Fill users array if user already connected
    fillUsersInChat(chatsSnapshot);
    setChatId(chatsSnapshot?.docs[0]?.id);
  };

  const handleStart = () => {
    setIsStarted(!isStarted);
    // Fill users array if user is connecting
    fillUsersInChat(chatsSnapshot);
    setChatId(chatsSnapshot?.docs[0]?.id);
  }

  // Set ref to get currentUser
  const getUsersRef = (user) => {
    if(user) {
      setUsersRef(db.collection("users").doc(user?.uid));
    }
  }
  useEffect(() => {
    getUsersRef(user);
  }, [user]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Portfolio Chat</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={handleClick}>Messagerie</button>
      {!user && isOpen && (
        <Login signIn={signIn} />
      )}
      {isOpen && user && (
        <>
          <h4>Bienvenue {user?.displayName}</h4>
          <button onClick={handleStart}>Start chatting</button>
        </>
      )}
      {isOpen && isStarted && (
        <Chat user={user} auth={auth} db={db} users={users} chatId={chatId} currentUser={currentUser} />
      )}
    </div>
  )
}
