const getRecipientEmail = (users, userLoggedIn) => {
  return users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0];
};

// const getRecipientName = (users, userLoggedIn) => {
//   return users?.filter(userToFilter => )
// }

export default getRecipientEmail;