import { canvasInit } from '../init/canvasInit.js';
import { wsInstance, wsConnection } from '../../api/wsHandler.js';
import {
  createIndexContainer,
  createCanvasContainer,
} from './contextContainer.js';

// Append the created index container to the body of the HTML document
document.body.appendChild(createIndexContainer());

const canvasForm = document.getElementById('canvas-form');
const canvasListElement = document.getElementById('canvas-list');

const createCanvasButton = (
  canvasName: string,
  canvasId: string,
  hostId: string
) => {
  const container = document.createElement('div');
  const btn = document.createElement('button');
  btn.innerHTML = canvasName;
  btn.addEventListener('click', () => enterCanvas(canvasId));

  container.appendChild(btn);

  if (hostId === localStorage.getItem('hostId')) {
    const dialogContainer = document.createElement('div');
    const removeButton = document.createElement('button');
    const confirmButton = document.createElement('button');
    confirmButton.innerHTML = 'confirm';
    confirmButton.addEventListener('click', () => deleteCanvas(canvasId));
    const cancelButton = document.createElement('button');
    cancelButton.addEventListener('click', () => {
      dialogContainer.style.display = 'none';
      removeButton.style.display = 'block';
    });
    dialogContainer.appendChild(confirmButton);
    dialogContainer.appendChild(cancelButton);
    dialogContainer.style.display = 'none';

    cancelButton.innerHTML = 'cancel';
    removeButton.innerHTML = 'remove';
    removeButton.addEventListener('click', () => {
      removeCanvas(canvasId);
      dialogContainer.style.display = 'block';
      removeButton.style.display = 'none';
    });
    container.appendChild(removeButton);
    container.appendChild(dialogContainer);
  }
  return container;
};

let websocket: WebSocket;
let canvasId: string;
export const wsSend = (eventLog: string) => {
  websocket.send(eventLog);
};

export const getCanvasId = () => {
  return canvasId;
};

const enterCanvas = async (id: string) => {
  fetch(`/canvas/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        // open canvas
        // Disable overview - html
        document.getElementById('index-container').style.display = 'none';
        if (!document.getElementById('canvas-container')) {
          document.body.appendChild(createCanvasContainer(leaveCanvas));
          // if container doesnt exist => first initialize canvas init once
          canvasInit();
        } else {
          document.getElementById('canvas-container').style.display = 'block';
        }
        // set current canvasId
        canvasId = id;
        //establisch websocket connection
        websocket = wsInstance(id);
        wsConnection(websocket, id);
      } else {
        console.log('Cant open canvas');
      }
    });
};

const removeCanvas = async (id: string) => {
  fetch(`/canvas/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        canvasId = id;
        //establisch websocket connection
        websocket = wsInstance(id);
        wsConnection(websocket, id);
      } else {
        console.log('Cant open canvas');
      }
    });
};

const deleteCanvas = async (id: string) => {
  const requestEvent = {
    command: 'host_disconnect',
    canvasId: id,
  };
  websocket.send(JSON.stringify(requestEvent));

  fetch(`/canvas/remove/${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        console.log('canvas deleted');
      } else {
        console.log('Cant delete canvas');
      }
    });
};

const leaveCanvas = () => {
  document.getElementById('canvas-container').style.display = 'none';
  document.getElementById('index-container').style.display = 'block';
  if (websocket) {
    const request = {
      command: 'unregisterForCanvas',
      canvasId: canvasId,
    };
    websocket.send(JSON.stringify(request));
  }
};

// Fetch the canvas list from the server
const fetchCanvases = async () => {
  fetch('api/all-canvas')
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        const canvasList = data.list;
        // Loop through the canvasList and create list items
        const listItems = canvasList.map((canvas) => {
          const liContainer = document.createElement('li');
          liContainer.style.width = '200px';
          liContainer.style.margin = '2px';
          liContainer.id = canvas.canvas_id;
          const listItem = createCanvasButton(
            canvas.name,
            canvas.canvas_id,
            canvas.host_id
          );
          liContainer.appendChild(listItem);
          return liContainer;
        });

        // Append the list items to the canvasListElement
        listItems.forEach((listItem: HTMLElement) => {
          canvasListElement.appendChild(listItem);
        });
      } else {
        // Handle the error case
        console.error(data.message);
      }
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });
};

const canvasSubmission = async (event: Event) => {
  event.preventDefault(); // Prevent the form from submitting normally

  const formData = new FormData(canvasForm as HTMLFormElement);
  formData.append('hostId', localStorage.getItem('hostId') || ''); // Append host_id to form data

  const obj = {
    name: formData.get('name'),
    hostId: formData.get('hostId'),
  };
  const response = await fetch('api/create', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj), // Send JSON data in the request body
  });

  if (response.ok) {
    // Handle success
    const body = await response.json();
    console.log('Form submitted successfully');
    // Set the hostId in localStorage
    localStorage.setItem('hostId', body.msg.hostId);

    const btn = createCanvasButton(
      body.msg.name,
      body.msg.canvasId,
      body.msg.hostId
    );
    canvasListElement.appendChild(btn);
    // Refresh the page or perform other actions
  } else {
    // Handle error
    console.error('Form submission failed');
  }
};

/* init */
canvasForm.addEventListener('submit', canvasSubmission);
fetchCanvases();
