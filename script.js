const STORAGE_KEYS = {
  html: "fr_builder_html",
  css: "fr_builder_css",
  js: "fr_builder_js",
  stable: "fr_builder_stable",
  actions: "fr_builder_actions"
};

const $ = (id) => document.getElementById(id);

const views = {
  home: $("homeView"),
  build: $("buildView"),
  preview: $("previewView"),
  history: $("historyView"),
  core: $("coreView")
};

const navButtons = document.querySelectorAll(".nav-btn");
const layerButtons = document.querySelectorAll(".layer-tab");

const editorFrames = {
  html: $("htmlFrame"),
  css: $("cssFrame"),
  js: $("jsFrame")
};

const editors = {
  html: $("htmlEditor"),
  css: $("cssEditor"),
  js: $("jsEditor")
};

const els = {
  workspaceTitle: $("workspaceTitle"),
  backToBuildBtn: $("backToBuildBtn"),
  previewFrame: $("previewFrame"),
  previewBadge: $("previewBadge"),
  saveBadge: $("saveBadge"),
  syncStatus: $("syncStatus"),
  homePreviewState: $("homePreviewState"),
  homeSaveState: $("homeSaveState"),
  homeCurrentMode: $("homeCurrentMode"),
  lockToggle: $("lockToggle"),
  coreLockState: $("coreLockState"),
  saveStableBtn: $("saveStableBtn"),
  quickSaveStableBtn: $("quickSaveStableBtn"),
  restoreStableBtn: $("restoreStableBtn"),
  previewBtn: $("previewBtn"),
  modePreviewBtn: $("modePreviewBtn"),
  exportBtn: $("exportBtn"),
  historyList: $("historyList"),
  fullScreenPreviewBtn: $("fullScreenPreviewBtn")
};

const state = {
  activeView: "build",
  activeLayer: "html",
  locked: false
};

const starter = {
  html: `<main style="padding:32px;font-family:Arial,sans-serif;">
  <h1>Hello FieldBuilder</h1>
  <p>Your preview is connected.</p>
  <button onclick="document.body.style.background='#f3f7ff'">Click Me</button>
</main>`,
  css: `body {
  margin: 0;
  background: #ffffff;
  color: #111111;
}`,
  js: `console.log("FieldBuilder preview connected");`
};

function exists(el) {
  return !!el;
}

function getEditorValues() {
  return {
    html: exists(editors.html) ? editors.html.value : "",
    css: exists(editors.css) ? editors.css.value : "",
    js: exists(editors.js) ? editors.js.value : ""
  };
}

function setText(el, text) {
  if (exists(el)) el.textContent = text;
}

function setSaveState(text) {
  setText(els.saveBadge, text);
  setText(els.syncStatus, text);
  setText(els.homeSaveState, text);
}

function switchView(name) {
  Object.keys(views).forEach((key) => {
    if (exists(views[key])) {
      views[key].classList.toggle("hidden", key !== name);
    }
  });

  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === name);
  });

  state.activeView = name;
  setText(els.homeCurrentMode, name.charAt(0).toUpperCase() + name.slice(1));
}

function switchLayer(name) {
  Object.keys(editorFrames).forEach((key) => {
    if (exists(editorFrames[key])) {
      editorFrames[key].classList.toggle("active", key === name);
    }
  });

  layerButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.layer === name);
  });

  setText(els.workspaceTitle, name.toUpperCase());
  state.activeLayer = name;
}

function setLock(locked) {
  state.locked = locked;

  Object.values(editors).forEach((editor) => {
    if (exists(editor)) editor.readOnly = locked;
  });

  setText(els.lockToggle, locked ? "Locked" : "Edit");
  setText(els.coreLockState, locked ? "Locked" : "Edit");
}

function saveDraft() {
  const values = getEditorValues();
  localStorage.setItem(STORAGE_KEYS.html, values.html);
  localStorage.setItem(STORAGE_KEYS.css, values.css);
  localStorage.setItem(STORAGE_KEYS.js, values.js);
  setSaveState("Draft Saved");
}

function loadDraft() {
  if (exists(editors.html)) {
    editors.html.value = localStorage.getItem(STORAGE_KEYS.html) || starter.html;
  }
  if (exists(editors.css)) {
    editors.css.value = localStorage.getItem(STORAGE_KEYS.css) || starter.css;
  }
  if (exists(editors.js)) {
    editors.js.value = localStorage.getItem(STORAGE_KEYS.js) || starter.js;
  }
}

function addHistory(type, note = "") {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.actions) || "[]");
  current.unshift({
    type,
    note,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.actions, JSON.stringify(current.slice(0, 30)));
  renderHistory();
}

function renderHistory() {
  if (!exists(els.historyList)) return;

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

  els.historyList.innerHTML = actions.map((item) => `
    <div class="history-item">
      <div class="history-top">
        <span class="history-type">${escapeHtml(item.type)}</span>
        <span class="history-time">${formatTime(item.timestamp)}</span>
      </div>
      <div class="history-note">${escapeHtml(item.note || "No note")}</div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function buildPreviewDocument() {
  const { html, css, js } = getEditorValues();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${css}
</style>
</head>
<body>
${html}
<script>
try {
${js}
} catch (error) {
  const errorBox = document.createElement("pre");
  errorBox.style.color = "red";
  errorBox.style.padding = "16px";
  errorBox.style.whiteSpace = "pre-wrap";
  errorBox.style.fontFamily = "monospace";
  errorBox.textContent = error.message;
  document.body.appendChild(errorBox);
}
<\/script>
</body>
</html>`;
}

function updatePreview() {
  if (!exists(els.previewFrame)) return;

  try {
    const fullDocument = buildPreviewDocument();
    const frameDoc = els.previewFrame.contentDocument || els.previewFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(fullDocument);
    frameDoc.close();

    setText(els.previewBadge, "Preview OK");
    if (exists(els.previewBadge)) els.previewBadge.classList.remove("broken");
    setText(els.homePreviewState, "OK");
  } catch (error) {
    setText(els.previewBadge, "Preview Broken");
    if (exists(els.previewBadge)) els.previewBadge.classList.add("broken");
    setText(els.homePreviewState, "Broken");
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

  if (exists(editors.html)) editors.html.value = stable.html || "";
  if (exists(editors.css)) editors.css.value = stable.css || "";
  if (exists(editors.js)) editors.js.value = stable.js || "";

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

async function openPreviewFullscreen() {
  if (!exists(els.previewFrame)) return;

  switchView("preview");

  const target = els.previewFrame;

  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    }
  } catch (err) {
    console.log("Fullscreen not available", err);
  }
}

function bindEvents() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  layerButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchLayer(btn.dataset.layer));
  });

  Object.values(editors).forEach((editor) => {
    if (!exists(editor)) return;

    editor.addEventListener("input", () => {
      setSaveState("Unsaved Changes");
      saveDraft();
      updatePreview();
    });
  });

  if (exists(els.backToBuildBtn)) {
    els.backToBuildBtn.addEventListener("click", () => switchView("build"));
  }

  if (exists(els.lockToggle)) {
    els.lockToggle.addEventListener("click", () => setLock(!state.locked));
  }

  if (exists(els.saveStableBtn)) {
    els.saveStableBtn.addEventListener("click", saveStable);
  }

  if (exists(els.quickSaveStableBtn)) {
    els.quickSaveStableBtn.addEventListener("click", saveStable);
  }

  if (exists(els.restoreStableBtn)) {
    els.restoreStableBtn.addEventListener("click", restoreStable);
  }

  if (exists(els.previewBtn)) {
    els.previewBtn.addEventListener("click", () => switchView("preview"));
  }

  if (exists(els.modePreviewBtn)) {
    els.modePreviewBtn.addEventListener("click", () => switchView("preview"));
  }

  if (exists(els.exportBtn)) {
    els.exportBtn.addEventListener("click", exportFiles);
  }

  if (exists(els.fullScreenPreviewBtn)) {
    els.fullScreenPreviewBtn.addEventListener("click", openPreviewFullscreen);
  }
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

document.addEventListener("DOMContentLoaded", init);