// Get the current URL
const currentUrl = window.location.href;

// Split the URL by "/"
const urlParts = currentUrl.split('/');

// The last part should be the UUID
const uuid = urlParts[urlParts.length - 1];

// Use the UUID in your WebSocket connection
const ws = new WebSocket(`ws://localhost:3000/canvas/${uuid}`);

const wsInit = () => {
  // When the WebSocket connection is established, receive the client ID from the server
  ws.onopen = () => {
    console.log('WebSocket connection established');

    // sign up
    const canvasId = uuid;
    const requestForRegistration = {
      command: 'registerForCanvas',
      canvasId: canvasId,
    };
    ws.send(JSON.stringify(requestForRegistration));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Incoming...');
    console.log(data);
    if (data.type === 'registration') {
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
