// Establish WebSocket connection to the server
const ws = new WebSocket('ws://localhost:3000/canvas/channel');
const wsInit = () => {
    // When the WebSocket connection is established, receive the client ID from the server
    ws.onopen = () => {
        console.log('WebSocket connection established');
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'clientId') {
            const clientId = data.clientId;
            console.log('Received client ID:', clientId);
            // Do something with the client ID, e.g., use it to identify the client on the canvas page
        }
    };
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
};
wsInit();
export default wsInit;
//# sourceMappingURL=wsHandler.js.map