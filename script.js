const socket = new WebSocket('ws://163.192.32.117:3000');

socket.onopen = () => {
    console.log('Connected to FieldOS Engine');
    document.body.style.border = "5px solid cyan"; // Visual confirmation
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Incoming Signal:', data);
    // Update your UI elements here
};

socket.onerror = (err) => {
    console.error('Socket Error:', err);
};
