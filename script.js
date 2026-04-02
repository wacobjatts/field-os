const STORAGE_KEYS = {
  html: "fr_builder_html",
  css: "fr_builder_css",
  js: "fr_builder_js",
  stable: "fr_builder_stable",
  actions: "fr_builder_actions"
};

const views = {
  home: document.getElementById("homeView"),
  build: document.getElementById("buildView"),
  preview: document.getElementById("previewView"),
  history: document.getElementById("historyView"),
  core: document.getElementById("coreView")
};

const navButtons = document.querySelectorAll(".nav-btn");
const layerButtons = document.querySelectorAll(".layer-tab");

const editorFrames = {
  html: document.getElementById("htmlFrame"),
  css: document.getElementById("cssFrame"),
  js: document.getElementById("jsFrame")
};

const editors = {
  html: document.getElementById("htmlEditor"),
  css: document.getElementById("cssEditor"),
  js: document.getElementById("jsEditor")
};

const els = {
  workspaceTitle: document.getElementById("workspaceTitle"),
  backToBuildBtn: document.getElementById("backToBuildBtn"),
  previewFrame: document.getElementById("previewFrame"),
  previewBadge: document.getElementById("previewBadge"),
  saveBadge: document.getElementById("saveBadge"),
  syncStatus: document.getElementById("syncStatus"),
  homePreviewState: document.getElementById("homePreviewState"),
  homeSaveState: document.getElementById("homeSaveState"),
  lockToggle: document.getElementById("lockToggle"),
  coreLockState: document.getElementById("coreLockState"),
  saveStableBtn: document.getElementById("saveStableBtn"),
  quickSaveStableBtn: document.getElementById("quickSaveStableBtn"),
  restoreStableBtn: document.getElementById("restoreStableBtn"),
  previewBtn: document.getElementById("previewBtn"),
  exportBtn: document.getElementById("exportBtn"),
  historyList: document.getElementById("historyList")
};

const state = {
  activeView: "build",
  activeLayer: "html",
  locked: false
};

const starter = {
  html: `<main style="padding: 32px; font-family: Arial, sans-serif;">
  <h1>Hello FieldBuilder</h1>
  <p>Your preview is now connected.</p>
  <button onclick="document.body.style.background='#f3f7ff'">Click Me</button>
</main>`,
  css: `body {
  margin: 0;
  background: #ffffff;
  color: #111111;
}`,
  js: `console.log("FieldBuilder preview connected");`
};

function getEditorValues() {
  return {
    html: editors.html.value,
    css: editors.css.value,
    js: editors.js.value
  };
}

function setSaveState(text) {
  els.saveBadge.textContent = text;
  els.syncStatus.textContent = text;
  els.homeSaveState.textContent = text;
}

function switchView(name) {
  Object.keys(views).forEach((key) => {
    views[key].classList.toggle("hidden", key !== name);
  });

  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === name);
  });

  state.activeView = name;
}

function switchLayer(name) {
  Object.keys(editorFrames).forEach((key) => {
    editorFrames[key].classList.toggle("active", key === name);
  });

  layerButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.layer === name);
  });

  els.workspaceTitle.textContent = name.toUpperCase();
  state.activeLayer = name;
}

function setLock(locked) {
  state.locked = locked;

  Object.values(editors).forEach((editor) => {
    editor.readOnly = locked;
  });

  els.lockToggle.textContent = locked ? "Locked" : "Edit";
  els.coreLockState.textContent = locked ? "Locked" : "Edit";
}

function saveDraft() {
  const values = getEditorValues();
  localStorage.setItem(STORAGE_KEYS.html, values.html);
  localStorage.setItem(STORAGE_KEYS.css, values.css);
  localStorage.setItem(STORAGE_KEYS.js, values.js);
  setSaveState("Draft Saved");
}

function loadDraft() {
  editors.html.value = localStorage.getItem(STORAGE_KEYS.html) || starter.html;
  editors.css.value = localStorage.getItem(STORAGE_KEYS.css) || starter.css;
  editors.js.value = localStorage.getItem(STORAGE_KEYS.js) || starter.js;
}

function addHistory(type, note = "") {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.actions) || "[]");
  current.unshift({
    type,
    note,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.actions, JSON.stringify(current.slice(0, 20)));
  renderHistory();
}

function renderHistory() {
  const actions = JSON.parse(localStorage.getItem(STORAGE_KEYS.actions) || "[]");
  if (!actions.length) {
    els.historyList.innerHTML = `
      <div class="history-item">
        <div class="history-top">
          <span class="history-type">System</span>
          <span class="history-time">Now</span>
        </div>
        <div class="history-note">History will appear here.</div>
      </div>
    `;
    return;
  }

  els.historyList.innerHTML = actions.map((item) => {
    return `
      <div class="history-item">
        <div class="history-top">
          <span class="history-type">${item.type}</span>
          <span class="history-time">${formatTime(item.timestamp)}</span>
        </div>
        <div class="history-note">${item.note || "No note"}</div>
      </div>
    `;
  }).join("");
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
  const { html, css, js } = getEditorValues();

  const fullDocument = `<!DOCTYPE html>
<html lang="en">
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
} catch (error) {
  const errorBox = document.createElement('pre');
  errorBox.style.color = 'red';
  errorBox.style.padding = '16px';
  errorBox.style.whiteSpace = 'pre-wrap';
  errorBox.textContent = error.message;
  document.body.appendChild(errorBox);
}
<\/script>
</body>
</html>`;

  try {
    const frameDoc = els.previewFrame.contentDocument || els.previewFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(fullDocument);
    frameDoc.close();

    els.previewBadge.textContent = "Preview OK";
    els.previewBadge.classList.remove("broken");
    els.homePreviewState.textContent = "OK";
  } catch (error) {
    els.previewBadge.textContent = "Preview Broken";
    els.previewBadge.classList.add("broken");
    els.homePreviewState.textContent = "Broken";
  }
}

function saveStable() {
  const stable = {
    ...getEditorValues(),
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEYS.stable, JSON.stringify(stable));
  setSaveState("Stable Saved");
  addHistory("Stable Saved", "Known good state stored");
}

function restoreStable() {
  const raw = localStorage.getItem(STORAGE_KEYS.stable);

  if (!raw) {
    alert("No stable version saved yet.");
    return;
  }

  const confirmed = confirm("Restore your stable version?");
  if (!confirmed) return;

  const stable = JSON.parse(raw);
  editors.html.value = stable.html || "";
  editors.css.value = stable.css || "";
  editors.js.value = stable.js || "";

  saveDraft();
  updatePreview();
  setSaveState("Stable Restored");
  addHistory("Stable Restored", "Returned to known good state");
}

function exportFiles() {
  const values = getEditorValues();
  downloadFile("index.html", values.html);
  downloadFile("style.css", values.css);
  downloadFile("script.js", values.js);
  addHistory("Exported", "Downloaded current HTML, CSS, and JS");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  layerButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchLayer(btn.dataset.layer));
  });

  Object.values(editors).forEach((editor) => {
    editor.addEventListener("input", () => {
      setSaveState("Unsaved Changes");
      saveDraft();
      updatePreview();
    });
  });

  els.backToBuildBtn.addEventListener("click", () => switchView("build"));
  els.lockToggle.addEventListener("click", () => setLock(!state.locked));
  els.saveStableBtn.addEventListener("click", saveStable);
  els.quickSaveStableBtn.addEventListener("click", saveStable);
  els.restoreStableBtn.addEventListener("click", restoreStable);
  els.previewBtn.addEventListener("click", () => switchView("preview"));
  els.exportBtn.addEventListener("click", exportFiles);
}

function init() {
  loadDraft();
  bindEvents();
  switchView("build");
  switchLayer("html");
  setLock(false);
  updatePreview();
  renderHistory();
  setSaveState("Draft Saved");
}

init();
