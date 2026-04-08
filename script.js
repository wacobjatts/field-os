// Point this to your server's IP so your phone can see the data
const socket = new WebSocket('ws://163.192.32.117:3000');

socket.onopen = () => {
    console.log('Connected to FieldOS Engine');
    // You can remove the "Not Connected" overlay here if you have one
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // This is where your TRON UI receives the live kinetics
    console.log('Live Signal:', data);
    
    // Update your dashboard elements here
    // Example: document.getElementById('price').innerText = data.price;
};

socket.onerror = (error) => {
    console.error('Connection Error. Make sure the server is running PM2.');
};
