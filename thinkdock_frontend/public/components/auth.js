const classButtonSignInOut = "button-sign-in-out";
const classIconAccount = "icon-account";

/**
 * Firebase Auth state observer
 */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    $("div." + classButtonSignInOut).children().last()
      .html("Sign out")
      .off("click")
      .on("click", googleLogout);

    if (user.photoURL) {
      $("div." + classButtonSignInOut + " div." + classIconAccount)
        .css("background-image", `url(${user.photoURL})`);
    }

    // Hide login/signup forms
    document.querySelector(".login-container").style.display = "none";
    document.querySelector(".signup-container").style.display = "none";

  } else {
    // User is signed out
    $("div." + classButtonSignInOut).children().last()
      .html("Sign in")
      .off("click")
      .on("click", () => {
        // Show login form when Sign in clicked
        toggleForms("login");
      });

    $("div." + classButtonSignInOut + " div." + classIconAccount)
      .css("background-image", "");
  }
});

/**
 * Google Sign-In
 */
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(console.error);
}

/**
 * Sign out
 */
function googleLogout() {
  firebase.auth().signOut().catch(console.error);
}

function toggleForms(formType) {
  document.querySelector(".login-container").style.display = (formType === "login") ? "block" : "none";
  document.querySelector(".signup-container").style.display = (formType === "signup") ? "block" : "none";
}

// === Click outside to close logic (safe version) ===
document.addEventListener("mousedown", function (e) {
  const loginContainer = document.querySelector(".login-container");
  const signupContainer = document.querySelector(".signup-container");

  // Do NOT close if clicked on the form or its children
  if (
    loginContainer &&
    loginContainer.style.display === "block" &&
    !loginContainer.contains(e.target)
  ) {
    loginContainer.style.display = "none";
  }

  if (
    signupContainer &&
    signupContainer.style.display === "block" &&
    !signupContainer.contains(e.target)
  ) {
    signupContainer.style.display = "none";
  }
});
