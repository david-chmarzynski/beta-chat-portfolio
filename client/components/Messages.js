import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import firebase from 'firebase/app'
import { useCollection } from "react-firebase-hooks/firestore";

export default function Messages({ users, user, chatId, messages, chat }) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [input, setInput] = useState("");
  const [messagesSnapshot] = useCollection(db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc'));
  // if(messagesSnapshot) {
  //   messagesSnapshot.docs.forEach(doc => {
  //     console.log(doc.data())
  //   });
  // }


  const sendMessage = (e) => {
    e.preventDefault();
    
    // Update last seen in DB
    db.collection('users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Write message in DB
    db.collection('chats').doc(chatId).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      chatId: chatId,
      user: user.email,
      photoURL: user.photoURL
    });

    // Clear input
    setInput("");
  };

  const handleInput = (e, input) => {
    e.preventDefault();
    setInput(e.target.value);
  };


  // const recipientEmail = getRecipientEmail(users, user);
  useEffect(() => {
    if(users.length > 0) setRecipientEmail(getRecipientEmail(users, user.email));
    // console.log(recipientEmail)
  });

  return (
    <div className="messages">
      <h3>Messages</h3>
        <h4>Conversation avec {recipientEmail}</h4>
        <input type="text" onChange={handleInput} value={input} />
        <button onClick={(e) => sendMessage(e, input)}>Envoyer</button>
        {messagesSnapshot && (
          messagesSnapshot.docs.map((message) => (<p key={message.id}>{message.data().message}</p>))
        )}
      </div>
  )
}

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(chat);

  // Prep messages
  const messageRes = await ref.collection('messages').orderBy('timestamp', 'asc').get();
  const messages = messageRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime()
  }));

  return {
    props: {
      messages: JSON.stringify(messages)
    }
  }
}