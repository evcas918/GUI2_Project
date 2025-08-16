(function () {
  const auth = firebase.auth();
  const storage = firebase.storage();

  // ---- open the PDF in a new tab inside the first panel ----
  function openPdfTab(fileName, downloadUrl) {
    const viewerUrl = downloadUrl + (downloadUrl.includes("#") ? "" : "#") + "zoom=page-width";
    const $iframe = $("<iframe>")
      .attr("src", viewerUrl)
      .css({ width: "100%", height: "100%", border: 0, background: "black" });

    const $panel = $(".panel").first();
    if (!$panel.length || typeof window.addTab !== "function") {
      console.error("Missing panel or addTab().");
      alert("Could not open PDF view — panel/addTab missing.");
      return;
    }
    addTab($panel, fileName, $iframe);
  }

  // ---- upload PDF to Storage, get a URL, then open it ----
  async function uploadAndOpenPdf(file) {
    const user = auth.currentUser;
    if (!user) { alert("Please sign in first."); return; }

    const lower = (file.name || "").toLowerCase();
    const looksPdf = (file.type === "application/pdf") || lower.endsWith(".pdf");
    if (!looksPdf) { alert("Only PDF files are supported right now."); return; }

    // path: user_files/{uid}/{timestamp}_{safeName}
    const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
    const path = `user_files/${user.uid}/${Date.now()}_${safeName}`;
    const ref = storage.ref(path);

    // Upload with the correct content type
    await new Promise((resolve, reject) => {
      const task = ref.put(file, { contentType: "application/pdf" });
      task.on("state_changed", null, reject, resolve);
    });

    const url = await ref.getDownloadURL();
    openPdfTab(file.name, url);
  }

  async function handleFiles(files) {
    for (const f of files) {
      try { await uploadAndOpenPdf(f); }
      catch (e) {
        console.error("PDF upload/open failed:", e);
        alert(`Could not open ${f.name}: ${e.message || e}`);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const picker = document.getElementById("localFilePicker");
    if (!picker) {
      console.warn("Missing #localFilePicker in HTML.");
      return;
    }
    picker.addEventListener("change", async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length) await handleFiles(files);
      picker.value = ""; // allow re-selecting same file again
    });

    const btn = document.getElementById("btnOpenLocalFiles");
    if (btn) btn.addEventListener("click", () => picker.click());
  });
})();
