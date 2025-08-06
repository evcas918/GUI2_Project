document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".login-form");
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;

try {
  await firebase.auth().signInWithEmailAndPassword(email, password);
  console.log("Successfully Logged In");

  // Clear fields after login
  loginEmail.value = "";
  loginPassword.value = "";

  // Hide form
  document.querySelector(".login-container").style.display = "none";
} catch (error) {
  console.error("Login failed:", error.message);
  alert("Login failed: " + error.message);
}

    });

  document.getElementById("login-reset").addEventListener("click", function () {
    loginEmail.value = "";
    loginPassword.value = "";
  });
});
