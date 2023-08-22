import { wsInstance, wsConnection } from '../../api/wsHandler.js';
import { createCanvasButton, } from './components/contextContainer.js';
import { getAllCanvases, getCanvasById, postCanvasSubmission, removeCanvasById, } from '../../api/fetch.js';
import { EClient, EWebsocketEvents } from '../../types/services.js';
import { handleURLLocation } from './router/router.js';
let websocket;
let canvasId;
export const wsSend = (eventLog) => {
    websocket.send(eventLog);
};
export const getCanvasId = () => {
    return canvasId;
};
export const joinCanvas = async (id) => {
    /* query database */
    const data = await getCanvasById(id);
    if (data) {
        /* if canvas container hasnt been initialized yet */
        /* store current canvas id */
        canvasId = id;
        //establisch websocket connection
        websocket = wsInstance(id);
        wsConnection(websocket, id);
        return true;
    }
    else {
        console.log('Cant open canvas');
        return false;
    }
};
export const openRemoveDialog = async (id) => {
    const data = await getCanvasById(id);
    if (data) {
        canvasId = id;
        //establisch websocket connection
        websocket = wsInstance(id);
        wsConnection(websocket, id);
    }
    else {
        console.log('Cant open canvas');
    }
};
export const closeRemoveDialog = () => {
    websocket.close();
};
export const disconnectClientsFromCanvas = async (id) => {
    const requestEvent = {
        command: EWebsocketEvents.HOST_DISCONNECT,
        canvasId: id,
        clientId: localStorage.getItem(EClient.CLIENT_ID),
    };
    websocket.send(JSON.stringify(requestEvent));
    await removeCanvasById(id);
};
export const leaveCanvas = () => {
    if (websocket) {
        const request = {
            command: EWebsocketEvents.UNREGISTER_FOR_CANVAS,
            canvasId: canvasId,
        };
        websocket.send(JSON.stringify(request));
    }
};
// Fetch the canvas list from the server
export const fetchCanvases = async () => {
    const data = await getAllCanvases();
    if (data.status === 200) {
        // Loop through the canvasList and create list items
        console.log(data);
        return data.list.canvasList;
    }
    else {
        // Handle the error case
        console.error(data.content);
    }
};
export const canvasSubmission = async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    const input = document.getElementById('name-submit');
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
        localStorage.setItem(EClient.HOST_ID, data.content.hostId);
        const btn = createCanvasButton(data.content.name, data.content.canvasId, data.content.hostId);
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
    }
    else {
        // Handle error
        console.error('Form submission failed');
    }
};
/* init */
handleURLLocation();
const canvasListElement = document.getElementById('canvas-list');
