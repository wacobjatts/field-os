// field-os/script.js
const SERVER_IP = '163.192.32.117';
const socket = new WebSocket(`ws://${SERVER_IP}:3000`);

socket.onopen = () => {
    console.log('✅ CONNECTED TO ENGINE');
    document.body.innerHTML = '<h1 style="color:cyan; font-family:monospace;">SYSTEM ONLINE: RECEIVING KINETICS</h1>';
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('📊 DATA:', data);
    // This is where your TRON indicators will plug in
};

socket.onerror = (err) => {
    console.error('❌ CONNECTION REFUSED. Check if PM2 is running and Port 3000 is open.');
};
