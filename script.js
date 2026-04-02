/* script.js */
const FieldOS = {
    state: {
        activeChamber: 'home',
        activeLayer: 'structure',
        pulses: 0,
        layers: {
            structure: '<h1>FieldOS</h1>\n<p>Vessel ready.</p>',
            style: 'body { background: #fdfdfd; padding: 50px; text-align: center; font-family: sans-serif; }',
            behavior: '// logic',
            data: '{ "status": "active" }'
        }
    },

    nav(chamberId) {
        document.querySelectorAll('.chamber').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        document.getElementById(`chamber-${chamberId}`).classList.add('active');
        const navItems = document.querySelectorAll('.nav-item');
        const index = ['home', 'build', 'preview', 'history', 'core'].indexOf(chamberId);
        if(navItems[index]) navItems[index].classList.add('active');

        if(chamberId === 'preview') this.manifest();
        this.state.activeChamber = chamberId;
    },

    setLayer(layerId) {
        document.querySelectorAll('.rail-item').forEach(r => r.classList.remove('active'));
        document.querySelectorAll('.editor-area').forEach(e => e.classList.remove('active'));

        document.querySelector(`[data-layer="${layerId}"]`).classList.add('active');
        document.getElementById(`editor-${layerId}`).classList.add('active');
        
        document.getElementById('active-layer-title').innerText = `Layer // ${layerId.charAt(0).toUpperCase() + layerId.slice(1)}`;
        this.state.activeLayer = layerId;
        this.updateStats();
    },

    updateStats() {
        const totalChars = Object.values(this.state.layers).join('').length;
        const energy = (totalChars / 1200).toFixed(2);
        const stability = Math.max(0.1, 1 - (energy * 0.1)).toFixed(2);

        document.getElementById('val-energy').innerText = energy;
        document.getElementById('val-stability').innerText = stability;
        document.getElementById('stat-pulses').innerText = this.state.pulses;
        document.getElementById('char-count').innerText = `${this.state.layers[this.state.activeLayer].length} Chars`;
    },

    sync(layerId, value) {
        this.state.layers[layerId] = value;
        this.state.pulses++;
        this.updateStats();
        localStorage.setItem('field_substrate_v2', JSON.stringify(this.state.layers));
    },

    manifest() {
        const frame = document.getElementById('manifest-surface');
        const doc = frame.contentDocument || frame.contentWindow.document;
        const blob = `
            <!DOCTYPE html><html><head><style>${this.state.layers.style}</style></head>
            <body>${this.state.layers.structure}<script>${this.state.layers.behavior}<\/script></body></html>
        `;
        doc.open();
        doc.write(blob);
        doc.close();
    },

    purge() {
        if(confirm("Confirm substrate reset?")) {
            localStorage.clear();
            location.reload();
        }
    },

    init() {
        // Hydrate
        const saved = JSON.parse(localStorage.getItem('field_substrate_v2'));
        if(saved) this.state.layers = saved;

        // Bind Editors
        Object.keys(this.state.layers).forEach(layer => {
            const el = document.getElementById(`editor-${layer}`);
            el.value = this.state.layers[layer];
            el.addEventListener('input', (e) => this.sync(layer, e.target.value));
        });

        this.updateStats();
        console.log("FieldOS Substrate Active");
    }
};

window.onload = () => FieldOS.init();

