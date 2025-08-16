/***************
 * ThinkDock Auth + Cloud Project I/O (Firebase compat)
 * Clean version — no jQuery override
 ***************/

const classButtonSignInOut = "button-sign-in-out";
const classIconAccount = "icon-account";

// ------- tiny DOM helpers (do NOT override jQuery $) -------
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const showSel = (sel) => { const el = qs(sel); if (el) el.style.display = "flex"; };
const hideSel = (sel) => { const el = qs(sel); if (el) el.style.display = "none"; };
const setText = (id, msg) => { const el = document.getElementById(id); if (!el) return; el.textContent = msg || ""; el.hidden = !msg; };

// Expose for inline onclicks if needed
window.openLogin  = () => showSel(".login-container");
window.openSignup = () => showSel(".signup-container");

// ------- Firebase -------
const auth = firebase.auth();
const storage = firebase.storage();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Google login/logout
function googleLogin()  { return auth.signInWithPopup(googleProvider); }
function googleLogout() { return auth.signOut(); }
window.googleLogout = googleLogout;

// ------- Cloud Project Save/Load/List/Delete -------
(function () {
  window.currentProjectName = window.currentProjectName || null;

  async function saveProject(projectName) {
    const user = auth.currentUser;
    if (!user) { alert("You must be signed in to save a project."); return; }

    let name = projectName;
    if (!name) {
      const field = document.getElementById("projectNameInput");
      name = (field && field.value.trim()) || window.promptForName(window.currentProjectName);
    }
    if (!name) return;

    const data = window.getCurrentWorkspaceState();
    const ref = storage.ref(`projects/${user.uid}/${name}.json`);
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    await ref.put(blob);
    window.currentProjectName = name;
    const field = document.getElementById("projectNameInput"); if (field) field.value = name;
    await loadProjectList();
    alert(`Saved "${name}" to the cloud.`);
  }

  async function loadProject(projectName) {
    const user = auth.currentUser;
    if (!user) { alert("You must be signed in to load a project."); return; }

    let name = projectName && projectName.trim();
    if (!name) {
      const field = document.getElementById("projectNameInput");
      name = field && field.value.trim();
    }
    if (!name) { name = window.promptForName("Project to open"); }
    if (!name) return;

    const ref = storage.ref(`projects/${user.uid}/${name}.json`);
    const url = await ref.getDownloadURL();
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    window.clearWorkspacePreservingAddButton();

    data.tabs.forEach((t, idx) => {
      window.createPanel(t.panelId, t.content);

      // Use jQuery if available (your app does)
      const $newTab = (typeof window.newTab === "function")
        ? window.newTab(t.title, window.jQuery("<div>"))
        : window.jQuery("<div>").addClass("tab").text(t.title);

      $newTab.data("panel-id", t.panelId);
      window.jQuery("." + window.classButtonTabAdd).before($newTab);

      const idxToActivate = (data.activeTabIndex ?? 0);
      if (idx === idxToActivate) {
        if (typeof window.tabSiblingsClearSelection === "function") window.tabSiblingsClearSelection.call($newTab);
        if (typeof window.tabSelect === "function") window.tabSelect.call($newTab);
        else $newTab.addClass("active");
      }
    });

    window.currentProjectName = name;
    const field = document.getElementById("projectNameInput"); if (field) field.value = name;
  }

  async function loadProjectList() {
    const $list = window.jQuery ? window.jQuery(".project-list") : null;
    if ($list && $list.length) $list.empty();

    const user = auth.currentUser;
    if (!user) { if ($list && $list.length) $list.append(window.jQuery("<div>").text("Sign in to see projects")); return; }

    const dirRef = storage.ref(`projects/${user.uid}`);
    let items = [];
    try { const res = await dirRef.listAll(); items = res.items || []; } catch (e) {}

    const names = items
      .filter(it => it.name.toLowerCase().endsWith(".json"))
      .map(it => it.name.replace(/\.json$/i, ""))
      .sort((a, b) => a.localeCompare(b));

    let $target = $list;
    if (!$target || $target.length === 0) {
      const $sidebar = window.jQuery ? window.jQuery(".sidebar, .sidebar-options").first() : null;
      if ($sidebar) {
        const $title = window.jQuery("<div>").text("Projects").css({ fontWeight: "600", marginTop: "12px", marginBottom: "6px" });
        $target = window.jQuery("<div>").addClass("project-list").css({ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "8px" });
        $sidebar.append($title, $target);
      }
    }


    names.forEach(name => {
      const $row = window.jQuery("<div>").addClass("project-row").css({ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" });
      const $btnOpen = window.jQuery("<button>").text(name).on("click", () => loadProject(name));
      const $actions = window.jQuery("<div>").css({ display: "flex", gap: "6px", marginLeft: "auto" });
      const $btnSave = window.jQuery("<button>").text("Save").attr("title", `Overwrite "${name}"`).on("click", () => saveProject(name));
      const $btnDel = window.jQuery("<button>").text("Delete").on("click", () => deleteProject(name));
      $actions.append($btnSave, $btnDel); $row.append($btnOpen, $actions); $target.append($row);
    });
  }

  async function deleteProject(projectName) {
    const user = auth.currentUser; if (!user) return;
    if (!confirm(`Delete project "${projectName}"?`)) return;
    const ref = storage.ref(`projects/${user.uid}/${projectName}.json`);
    await ref.delete();
    if (window.currentProjectName === projectName) window.currentProjectName = null;
    await loadProjectList();
  }

  // Expose for inline
  window.saveProject = saveProject;
  window.loadProject = loadProject;
  window.loadProjectList = loadProjectList;
  window.deleteProject = deleteProject;
})();

// ------- Modal forms (email/password + Google) -------
function wireAuthForms() {
  // Switch links
  document.getElementById("to-signup")?.addEventListener("click", (e) => {
    e.preventDefault(); hideSel(".login-container"); showSel(".signup-container");
  });
  document.getElementById("to-login")?.addEventListener("click", (e) => {
    e.preventDefault(); hideSel(".signup-container"); showSel(".login-container");
  });

  // LOGIN (email/password)
  document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    setText("login-error", "");
    const email = document.getElementById("login-email")?.value || "";
    const pass  = document.getElementById("login-password")?.value || "";
    try { await auth.signInWithEmailAndPassword(email, pass); hideSel(".login-container"); }
    catch (err) { setText("login-error", err.message || "Failed to log in."); }
  });

  // LOGIN with Google
  document.getElementById("login-google")?.addEventListener("click", async () => {
    setText("login-error", "");
    try { await googleLogin(); hideSel(".login-container"); }
    catch (err) { setText("login-error", err.message || "Google sign-in failed."); }
  });

  // SIGNUP (email/password)
  document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    setText("signup-error", "");
    const email = document.getElementById("signup-email")?.value || "";
    const pass  = document.getElementById("signup-password")?.value || "";
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      try { await cred.user.sendEmailVerification(); } catch {}
      hideSel(".signup-container");
      showSel(".login-container");
    } catch (err) {
      setText("signup-error", err.message || "Failed to create account.");
    }
  });

  // SIGNUP with Google
  document.getElementById("signup-google")?.addEventListener("click", async () => {
    setText("signup-error", "");
    try { await googleLogin(); hideSel(".signup-container"); }
    catch (err) { setText("signup-error", err.message || "Google sign-in failed."); }
  });
}

// ------- Header button bind (uses jQuery, now safe) -------
function bindHeaderAuthButton(user) {
  const $btn = window.jQuery ? window.jQuery("div." + classButtonSignInOut) : null;
  if (!$btn || !$btn.length) return;
  const $label = $btn.children().last();
  const $icon = $btn.find("div." + classIconAccount);

  $btn.off("click");
  if (user) {
    $label.text("Sign out");
    if (user.photoURL) {
      $icon.css({ backgroundImage: `url(${user.photoURL})`, backgroundSize: "cover", backgroundPosition: "center" });
    }
    $btn.css("cursor", "pointer").on("click", () => googleLogout().catch(err => console.error("Sign-out failed:", err)));
  } else {
    $label.text("Sign in");
    $icon.css("backgroundImage", "");
    $btn.css("cursor", "pointer").on("click", () => showSel(".login-container"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  wireAuthForms();

  // Hide workspace until auth resolved (visibility so layout init isn't broken)
  const appBits = [".panel-root", ".sidebar"];
  appBits.forEach(sel => { const el = qs(sel); if (el) el.style.visibility = "hidden"; });

  auth.onAuthStateChanged(async (user) => {
    bindHeaderAuthButton(user);

    if (user) {
      hideSel(".login-container");
      hideSel(".signup-container");
      appBits.forEach(sel => { const el = qs(sel); if (el) el.style.visibility = "visible"; });
      if (typeof window.loadProjectList === "function") await window.loadProjectList();
    } else {
      // Show LOGIN first for signed-out users
      showSel(".login-container");
      hideSel(".signup-container");
      appBits.forEach(sel => { const el = qs(sel); if (el) el.style.visibility = "hidden"; });
      const $list = window.jQuery ? window.jQuery(".project-list") : null;
      if ($list && $list.length) $list.empty().append(window.jQuery("<div>").text("Sign in to see projects"));
    }
  });
});

