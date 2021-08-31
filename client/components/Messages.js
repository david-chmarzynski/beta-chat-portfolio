import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

export default function Messages({ users, user }) {
  const [recipientEmail, setRecipientEmail] = useState("");

  const sendMessage = () => {

  };

  const handleInput = () => {

  };


  // const recipientEmail = getRecipientEmail(users, user);
  useEffect(() => {
    if(users.length > 0) setRecipientEmail(getRecipientEmail(users, user.email));
    console.log(recipientEmail)
  });

  return (
    <div className="messages">
      <h3>Messages</h3>
        <h4>Conversation avec {recipientEmail}</h4>
        <input type="text" onChange={handleInput}/>
        <button onClick={(e) => sendMessage(e, input)}>Envoyer</button>
      </div>
  )
}