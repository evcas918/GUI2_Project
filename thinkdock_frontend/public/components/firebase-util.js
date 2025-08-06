function getCurrentUserId() {
  const user = firebase.auth().currentUser;
  return user ? user.uid : null;
}
