document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.querySelector(".signup-form");
  const signupEmail = document.getElementById("signup-email");
  const signupPassword = document.getElementById("signup-password");

  signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = signupEmail.value;
    const password = signupPassword.value;

    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log("Account created successfully");

      // Hide form after signup
      document.querySelector(".signup-container").style.display = "none";
    } catch (error) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
    }
  });

  document.getElementById("signup-reset").addEventListener("click", function () {
    signupEmail.value = "";
    signupPassword.value = "";
  });
});
