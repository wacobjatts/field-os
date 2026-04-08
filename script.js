// script.js (The Browser Bridge)
const SERVER_IP = '163.192.32.117';
const socket = new WebSocket(`ws://${SERVER_IP}:3000`);

socket.onopen = () => {
    console.log('✅ CONNECTED TO ENGINE');
    // Change UI to show we are live
    const status = document.getElementById('status');
    if (status) status.innerText = 'ONLINE';
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('📊 LIVE KINETICS:', data);
    // Update your TRON gauges here
};

socket.onerror = (err) => {
    console.error('❌ CONNECTION ERROR: The server or firewall is blocking us.');
};
