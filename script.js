const htmlInput = document.getElementById("htmlInput");
const cssInput = document.getElementById("cssInput");
const jsInput = document.getElementById("jsInput");
const preview = document.getElementById("preview");

function updatePreview() {
  const html = htmlInput.value;
  const css = `<style>${cssInput.value}</style>`;
  const js = `<script>${jsInput.value}<\/script>`;

  const full = `
    <html>
      <head>${css}</head>
      <body>
        ${html}
        ${js}
      </body>
    </html>
  `;

  const doc = preview.contentDocument;
  doc.open();
  doc.write(full);
  doc.close();
}

htmlInput.addEventListener("input", updatePreview);
cssInput.addEventListener("input", updatePreview);
jsInput.addEventListener("input", updatePreview);

// starter content
htmlInput.value = "<h1>Hello FieldBuilder</h1>";
cssInput.value = "h1 { color: red; }";
jsInput.value = "console.log('running');";

updatePreview();