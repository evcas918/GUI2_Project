var Cloud = {
	/**
	 * Gets a specified file at a bucket url
	 *
	 * @param      {string}   bucketURL  The url of the server bucket
	 * @param      {string}   filePath   The file path
	 * @return     {promise}  The a promise of a file blob
	 */
	getFile: function(bucketURL, filePath) {
		return firebase.storage().refFromURL(bucketURL)
			.child(filePath).getDownloadURL()
				.then(url => {
					return fetch(url)
						.then(res => res.blob());
				});
	},

	/**
	 * Create or edit a file at a bucket url
	 *
	 * @param      {string}  bucketURL  The url of the server bucket
	 * @param      {string}  filePath   The file path
	 * @param      {Blob}    blob       The file blob to upload
	 */
	editFile: function(bucketURL, filePath, blob) {
		firebase.storage().refFromURL(bucketURL)
			.child(filePath).put(blob);
	},

	/**
	 * Delete a file at a bucket url
	 *
	 * @param      {string}  bucketURL  The url of the server bucket
	 * @param      {string}  filePath   The file path
	 */
	deleteFile: function(bucketURL, filePath) {
		firebase.storage().refFromURL(bucketURL)
			.child(filePath).delete();	
	}
}

/**
 * WRITE FILE EXAMPLE
 */
// const jsonData = {
// 	name: "Seth",
// 	value: 99
// };
// const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
// Cloud.editFile("gs://thinkdock-a48f9.firebasestorage.app", "test.json", jsonBlob);


/**
 * READ FILE EXAMPLE
 */
// Cloud.getFile("gs://thinkdock-a48f9.firebasestorage.app", "test.json")
// 	.then(jsonBlob => jsonBlob.text())
// 	.then(text => {
// 		console.log(text);
// 	});

/* public/js/file-handle.js */
(function () {
  // ---- util: safe DOM helper ----
  function onClick(selector, handler) {
    document.addEventListener("click", function (e) {
      const el = e.target.closest(selector);
      if (el) handler(e, el);
    });
  }

  function onChange(selector, handler) {
    document.addEventListener("change", function (e) {
      const el = e.target.closest(selector);
      if (el) handler(e, el);
    });
  }

  // ---- wire the button -> hidden input ----
  onClick("#btnOpenLocalFiles", function () {
    const picker = document.getElementById("localFilePicker");
    if (!picker) {
      alert("Missing #localFilePicker input in HTML.");
      return;
    }
    picker.click();
  });

  // ---- handle chosen files ----
  onChange("#localFilePicker", function (e, input) {
    const files = Array.from(input.files || []);
    files.forEach(openFileAsTab);
    // allow re-selecting the same file later
    input.value = "";
  });

  // ---- open a single file into a new tab+panel ----
  function openFileAsTab(file) {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const panelId = uniquePanelId(file.name);

    if (ext === "pdf") {
      const url = URL.createObjectURL(file);
      const html = `
        <div style="height:100%; width:100%;">
          <object data="${url}" type="application/pdf" style="width:100%; height:100%; min-height:70vh;">
            <p>This browser cannot display the PDF.
               <a href="${url}" target="_blank" rel="noopener">Open in a new tab</a>.
            </p>
          </object>
        </div>`;
      ensurePanel(panelId, html);
      createTabForPanel(file.name.replace(/\.pdf$/i, ""), panelId);
    } else if (ext === "txt" || ext === "md") {
      const reader = new FileReader();
      reader.onload = function () {
        const safe = escapeHtml(reader.result || "");
        const html = `<pre style="white-space:pre-wrap; color:white; font-family:monospace;">${safe}</pre>`;
        ensurePanel(panelId, html);
        createTabForPanel(file.name, panelId);
      };
      reader.readAsText(file);
    } else {
      alert(`Unsupported file type: ${ext}. Try .pdf, .txt, or .md`);
    }
  }

  // ---- helpers used by your tab system ----
  function ensurePanel(panelId, html) {
    if (typeof window.createPanel === "function") {
      window.createPanel(panelId, html);
      return;
    }
    // fallback: create a .panel if your helper isn't loaded for some reason
    const root = document.querySelector(".panel-root") || document.body;
    let panel = document.getElementById(panelId);
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "panel";
      panel.id = panelId;
      root.appendChild(panel);
    }
    panel.innerHTML = html || "";
  }

  function createTabForPanel(title, panelId) {
    const stub = document.createElement("div"); // content already injected in panel
    let $newTab;
    if (typeof window.newTab === "function") {
      // if newTab returns a jQuery object, keep it; otherwise wrap
      const ret = window.newTab(title, window.jQuery ? window.jQuery(stub) : stub);
      $newTab = window.jQuery ? ret : null;
    }
    // If your newTab didn’t return a jQuery element, create a minimal fallback
    if (!$newTab) {
      if (window.jQuery) {
        $newTab = window.jQuery('<div class="tab"><span class="tab-title"></span></div>');
        $newTab.find(".tab-title").text(title);
      } else {
        const el = document.createElement("div");
        el.className = "tab";
        el.textContent = title;
        document.querySelector("." + (window.classButtonTabAdd || "button-tab-add"))?.before(el);
        el.dataset.panelId = panelId;
        el.classList.add("active");
        return;
      }
    }
    // link tab -> panel
    $newTab.data("panel-id", panelId);
    window.jQuery("." + (window.classButtonTabAdd || "button-tab-add")).before($newTab);

    // select the new tab using your tab helpers if present
    if (typeof window.tabSiblingsClearSelection === "function") {
      window.tabSiblingsClearSelection.call($newTab);
    } else {
      window.jQuery(".tab").removeClass("active");
    }
    if (typeof window.tabSelect === "function") {
      window.tabSelect.call($newTab);
    } else {
      $newTab.addClass("active");
    }
  }

  function uniquePanelId(base) {
    const slug = (base || "panel").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    let id = "panel-" + slug;
    let i = 1;
    while (document.getElementById(id)) id = "panel-" + slug + "-" + i++;
    return id;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
