
const classButtonSignInOut = "button-sign-in-out";
const classIconAccount = "icon-account";

/**
 * Sign in with Google
 */
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

/**
 * Logout from the Google account
 */
function googleLogout() {
	firebase.auth().signOut();
}

/**
 * Called when the login state is changed (login / logout)
 */
firebase.auth().onAuthStateChanged(function(user) {
	/* Oh god this whole thing is held together with tape and toothpicks */
	// If the user is logged in
	if (user) {
		// Update the sign in/out button to say sign out
		$("div." + classButtonSignInOut).children().last()
			.html("Sign out")
			.on("click", googleLogout);

		// Set the profile icon to be the account profile photo if it exists
		if (user.photoURL)
			$("div." + classButtonSignInOut + " div." + classIconAccount)
				.css("background-image", `url(${user.photoURL})`);
	} else {
		// Update the sign in/out button to say sign in
		$("div." + classButtonSignInOut).children().last()
			.html("Sign in")
			.on("click", googleLogin);

		// Revert the profile picture
		$("div." + classButtonSignInOut + " div." + classIconAccount)
			.css("background-image", "");
	}
});