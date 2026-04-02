const STORAGE_KEYS = {
  html: "fr_builder_html",
  css: "fr_builder_css",
  js: "fr_builder_js",
  stable: "fr_builder_stable",
  actions: "fr_builder_actions"
};

const els = {
  htmlEditor: document.getElementById("htmlEditor"),
  cssEditor: document.getElementById("cssEditor"),
  jsEditor: document.getElementById("jsEditor"),
  editorTitle: document.getElementById("editorTitle"),
  saveBadge: document.getElementById("saveBadge"),
  syncStatus: document.getElementById("syncStatus"),
  previewFrame: document.getElementById("previewFrame"),
  previewStateBadge: document.getElementById("previewStateBadge"),
  lockToggle: document.getElementById("lockToggle"),
  saveStableBtn: document.getElementById("saveStableBtn"),
  restoreStableBtn: document.getElementById("restoreStableBtn"),
  quickPreviewBtn: document.getElementById("quickPreviewBtn"),
  quickSaveBtn: document.getElementById("quickSaveBtn"),
  quickRestoreBtn: document.getElementById("quickRestoreBtn"),
  backToBuildBtn: document.getElementById("backToBuildBtn"),
  exportBtn: document.getElementById("exportBtn"),
  homeCurrentTab: document.getElementById("homeCurrentTab"),
  homePreviewState: document.getElementById("homePreviewState"),
  homeDraftState: document.getElementById("homeDraftState"),
  homeStableState: document.getElementById("homeStableState"),
  coreLockState: document.getElementById("coreLockState"),
  historyList: document.getElementById("historyList")
};

const state = {
  activeView: "build",
  activeLayer: "html",
  locked: false,
  unsaved: false
};

const starter = {
  html: `<main style="padding: 32px; font-family: Arial, sans-serif;">
  <h1>FieldBuilder</h1>
  <p>This is your live preview.</p>
</main>`,
  css: `body {
  margin: 0;
  background: #ffffff;
  color: #111111;
}`,
  js: `console.log("FieldBuilder preview ready");`
};

function getEditors() {
  return {
    html: els.htmlEditor.value,
    css: els.cssEditor.value,
    js: els.jsEditor.value
  };
}

function setSaveStatus(text) {
  els.saveBadge.textContent = text;
  els.syncStatus.textContent = text;
  els.homeDraftState.textContent = text;
}

function saveDraft() {
  const values = getEditors();
  localStorage.setItem(STORAGE_KEYS.html, values.html);
  localStorage.setItem(STORAGE_KEYS.css, values.css);
  localStorage.setItem(STORAGE_KEYS.js, values.js);
  setSaveStatus("Draft Saved");
}

function loadDraft() {
  els.htmlEditor.value = localStorage.getItem(STORAGE_KEYS.html) || starter.html;
  els.cssEditor.value = localStorage.getItem(STORAGE_KEYS.css) || starter.css;
  els.jsEditor.value = localStorage.getItem(STORAGE_KEYS.js) || starter.js;
}

function addAction(type, note = "") {
  const actions = JSON.parse(localStorage.getItem(STORAGE_KEYS.actions) || "[]");
  actions.unshift({
    type,
    note,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.actions, JSON.stringify(actions.slice(0, 20)));
  renderHistory();
}

function saveStable() {
  const snapshot = {
    ...getEditors(),
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.stable, JSON.stringify(snapshot));
  state.unsaved = false;
  setSaveStatus("Stable Saved");
  els.homeStableState.textContent = "Yes";
  addAction("Stable Saved", "Known good state saved");
}

function restoreStable() {
  const raw = localStorage.getItem(STORAGE_KEYS.stable);
  if (!raw) {
    alert("No stable version saved yet.");
    return;
  }

  const confirmed = confirm("Restore the stable version and replace current draft?");
  if (!confirmed) return;

  const stable = JSON.parse(raw);
  els.htmlEditor.value = stable.html || "";
  els.cssEditor.value = stable.css || "";
  els.jsEditor.value = stable.js || "";
  state.unsaved = false;
  saveDraft();
  updatePreview();
  setSaveStatus("Stable Restored");
  addAction("Stable Restored", "Returned to saved stable");
}

function renderHistory() {
  const actions = JSON.parse(localStorage.getItem(STORAGE_KEYS.actions) || "[]");
  els.historyList.innerHTML = "";

  if (!actions.length) {
    els.historyList.innerHTML = `<div class="history-item"><div class="history-note">No history yet.</div></div>`;
    return;
  }

  actions.forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.innerHTML = `
      <div class="history-top">
        <span class="history-type">${item.type}</span>
        <span class="history-time">${formatTime(item.timestamp)}</span>
      </div>
      <div class="history-note">${item.note || "No note"}</div>
    `;
    els.historyList.appendChild(row);
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function updatePreview() {
  const { html, css, js } = getEditors();

  const doc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>
try {
${js}
} catch (err) {
  document.body.innerHTML += '<pre style="color:red;padding:16px;">' + err.message + '</pre>';
}
<\/script>
</body>
</html>`;

  const frameDoc = els.previewFrame.contentDocument || els.previewFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(doc);
  frameDoc.close();

  els.previewStateBadge.textContent = "Preview OK";
  els.previewStateBadge.className = "preview-state ok";
  els.homePreviewState.textContent = "OK";
}

function switchLayer(layer) {
  state.activeLayer = layer;
  document.querySelectorAll(".layer-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.layer === layer);
  });
  document.querySelectorAll(".editor").forEach((editor) => {
    editor.classList.remove("active");
  });

  if (layer === "html") {
    els.htmlEditor.classList.add("active");
    els.editorTitle.textContent = "HTML";
    els.homeCurrentTab.textContent = "HTML";
  }
  if (layer === "css") {
    els.cssEditor.classList.add("active");
    els.editorTitle.textContent = "CSS";
    els.homeCurrentTab.textContent = "CSS";
  }
  if (layer === "js") {
    els.jsEditor.classList.add("active");
    els.editorTitle.textContent = "JS";
    els.homeCurrentTab.textContent = "JS";
  }
}

function switchView(view) {
  state.activeView = view;

  document.querySelectorAll(".view-panel").forEach((panel) => panel.classList.add("hidden"));
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });

  if (view === "home") document.getElementById("homeView").classList.remove("hidden");
  if (view === "build") document.getElementById("buildView").classList.remove("hidden");
  if (view === "preview") document.getElementById("previewView").classList.remove("hidden");
  if (view === "history") document.getElementById("historyView").classList.remove("hidden");
  if (view === "core") document.getElementById("coreView").classList.remove("hidden");
}

function setLock(locked) {
  state.locked = locked;
  [els.htmlEditor, els.cssEditor, els.jsEditor].forEach((editor) => {
    editor.readOnly = locked;
  });
  els.lockToggle.textContent = locked ? "Locked" : "Edit";
  els.coreLockState.textContent = locked ? "Locked" : "Edit";
}

function exportFiles() {
  const { html, css, js } = getEditors();

  downloadFile("index.html", html);
  downloadFile("style.css", css);
  downloadFile("script.js", js);
  addAction("Exported", "Downloaded HTML, CSS, and JS files");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function markUnsaved() {
  state.unsaved = true;
  setSaveStatus("Unsaved Changes");
}

function bindEvents() {
  document.querySelectorAll(".layer-tab").forEach((btn) => {
    btn.addEventListener("click", () => switchLayer(btn.dataset.layer));
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  [els.htmlEditor, els.cssEditor, els.jsEditor].forEach((editor) => {
    editor.addEventListener("input", () => {
      markUnsaved();
      saveDraft();
      updatePreview();
    });
  });

  els.lockToggle.addEventListener("click", () => setLock(!state.locked));
  els.saveStableBtn.addEventListener("click", saveStable);
  els.restoreStableBtn.addEventListener("click", restoreStable);
  els.quickSaveBtn.addEventListener("click", saveStable);
  els.quickRestoreBtn.addEventListener("click", restoreStable);
  els.quickPreviewBtn.addEventListener("click", () => switchView("preview"));
  els.backToBuildBtn.addEventListener("click", () => switchView("build"));
  els.exportBtn.addEventListener("click", exportFiles);
}

function init() {
  loadDraft();
  bindEvents();
  switchLayer("html");
  switchView("build");
  setLock(false);
  updatePreview();
  renderHistory();

  if (localStorage.getItem(STORAGE_KEYS.stable)) {
    els.homeStableState.textContent = "Yes";
  }

  setSaveStatus("Draft Saved");
}

init();