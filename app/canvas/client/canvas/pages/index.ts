import { canvasInit } from '../init/canvasInit.js';
import { wsInstance, wsConnection } from '../../api/wsHandler.js';
import {
  createIndexContainer,
  createCanvasContainer,
  setActiveIndexContainer,
  setActiveCanvasContainer,
  switchActiveContainer,
  createListContainer,
  createCanvasButton,
} from './components/contextContainer.js';
import {
  T_ApiData,
  getAllCanvases,
  getCanvasById,
  postCanvasSubmission,
  removeCanvasById,
} from '../../api/fetch.js';

let websocket: WebSocket;
let canvasId: string;

// Append the created index container to the body of the HTML document
document.body.appendChild(createIndexContainer());

const canvasForm = document.getElementById('canvas-form');
const canvasListElement = document.getElementById('canvas-list');

export const wsSend = (eventLog: string) => {
  websocket.send(eventLog);
};

export const getCanvasId = () => {
  return canvasId;
};

export const joinCanvas = async (id: string) => {
  /* query database */
  const data: T_ApiData = await getCanvasById(id);
  if (data) {
    setActiveIndexContainer(false);
    /* if canvas container hasnt been initialized yet */
    if (!document.getElementById('canvas-container')) {
      document.body.appendChild(createCanvasContainer(leaveCanvas));
      canvasInit();
    } else {
      setActiveCanvasContainer(true);
    }
    /* store current canvas id */
    canvasId = id;
    //establisch websocket connection
    websocket = wsInstance(id);
    wsConnection(websocket, id);
  } else {
    console.log('Cant open canvas');
  }
};

export const openRemoveDialog = async (id: string) => {
  console.log(id);
  const data: T_ApiData = await getCanvasById(id);
  if (data) {
    canvasId = id;
    //establisch websocket connection
    websocket = wsInstance(id);
    wsConnection(websocket, id);
  } else {
    console.log('Cant open canvas');
  }
};

export const closeRemoveDialog = () => {
  websocket.close();
};

export const disconnectClientsFromCanvas = async (id: string) => {
  const requestEvent = {
    command: 'host_disconnect',
    canvasId: id,
  };
  websocket.send(JSON.stringify(requestEvent));

  await removeCanvasById(id);
};

const leaveCanvas = () => {
  switchActiveContainer(true);
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
  const data: T_ApiData = await getAllCanvases();
  if (data.status === 200) {
    // Loop through the canvasList and create list items
    const listItems = createListContainer(data.content);

    // Append the list items to the canvasListElement
    listItems.forEach((listItem: HTMLElement) => {
      canvasListElement.appendChild(listItem);
    });
  } else {
    // Handle the error case
    console.error(data.content);
  }
};

const canvasSubmission = async (event: Event) => {
  event.preventDefault(); // Prevent the form from submitting normally
  const input = document.getElementById('name-submit') as HTMLInputElement;

  if (input.value === '') {
    console.log('empty string cant be inserted as set');
    return;
  }
  const response = await postCanvasSubmission();

  if (response.ok) {
    // Handle success
    const data = await response.json();
    console.log('Form submitted successfully');
    // Set the hostId in localStorage
    localStorage.setItem('hostId', data.content.hostId);

    const btn = createCanvasButton(
      data.content.name,
      data.content.canvasId,
      data.content.hostId
    );

    // clear input field
    input.value = '';

    // create new list element
    const listElement = document.createElement('li');
    listElement.style.width = '200px';
    listElement.style.margin = '2px';
    listElement.id = data.content.canvasId;
    listElement.appendChild(btn);

    canvasListElement.appendChild(listElement);
    // Refresh the page or perform other actions
  } else {
    // Handle error
    console.error('Form submission failed');
  }
};

/* init */
canvasForm.addEventListener('submit', canvasSubmission);
fetchCanvases();
