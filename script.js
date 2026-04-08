// This script runs in your browser and connects to your server IP
const socket = new WebSocket('ws://163.192.32.117:3000');

socket.onopen = () => {
    console.log('Connected to FieldOS Engine');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Live Data:', data);
    // Add your UI update logic here
};

socket.onerror = (error) => {
    console.error('Socket Error: Check if the server is running and port 3000 is open.');
};
