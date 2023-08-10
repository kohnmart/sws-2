import init from './init.js';
import { wsInstance, wsConnection } from './wsHandler.js';
const createIndexContainer = () => {
    const indexContainer = document.createElement('div');
    indexContainer.id = 'index-container';
    const heading = document.createElement('h1');
    heading.textContent = 'Canvas Overview';
    indexContainer.appendChild(heading);
    const canvasListDiv = document.createElement('div');
    const canvasList = document.createElement('ul');
    canvasList.id = 'canvas-list';
    canvasListDiv.appendChild(canvasList);
    indexContainer.appendChild(canvasListDiv);
    const createCanvasDiv = document.createElement('div');
    const createCanvasParagraph = document.createElement('p');
    createCanvasParagraph.textContent = 'Erstelle ein neues Canvas:';
    createCanvasDiv.appendChild(createCanvasParagraph);
    const canvasForm = document.createElement('form');
    canvasForm.id = 'canvas-form';
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    nameLabel.setAttribute('for', 'name');
    const nameInput = document.createElement('input');
    nameInput.name = 'name';
    nameInput.type = 'text';
    const submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.value = 'Erstellen';
    canvasForm.appendChild(nameLabel);
    canvasForm.appendChild(nameInput);
    canvasForm.appendChild(submitInput);
    createCanvasDiv.appendChild(canvasForm);
    indexContainer.appendChild(createCanvasDiv);
    return indexContainer;
};
const createCanvasContainer = () => {
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';
    const returnButton = document.createElement('button');
    returnButton.addEventListener('click', leaveCanvas);
    returnButton.innerText = 'Leave Canvas';
    canvasContainer.appendChild(returnButton);
    const paragraph = document.createElement('p');
    paragraph.textContent =
        'Wählen Sie auf der linken Seite Ihr Zeichwerkzeug aus. Haben Sie eines ausgewählt, können Sie mit der Maus die entsprechenden Figuren zeichnen. Typischerweise, indem Sie die Maus drücken, dann mit gedrückter Maustaste die Form bestimmen, und dann anschließend die Maustaste loslassen.';
    canvasContainer.appendChild(paragraph);
    const toolsList = document.createElement('ul');
    toolsList.className = 'tools';
    canvasContainer.appendChild(toolsList);
    const canvas = document.createElement('canvas');
    canvas.id = 'drawArea';
    canvas.width = 900;
    canvas.height = 800;
    canvasContainer.appendChild(canvas);
    const eventStreamDiv = document.createElement('div');
    eventStreamDiv.id = 'eventstream';
    const loadEventStreamBtn = document.createElement('button');
    loadEventStreamBtn.id = 'load-event-stream-btn';
    loadEventStreamBtn.textContent = 'Event-Stream laden';
    eventStreamDiv.appendChild(loadEventStreamBtn);
    const eventStreamTextarea = document.createElement('textarea');
    eventStreamTextarea.id = 'event-stream-textarea';
    eventStreamDiv.appendChild(eventStreamTextarea);
    canvasContainer.appendChild(eventStreamDiv);
    const menuDisplayDiv = document.createElement('div');
    menuDisplayDiv.id = 'menu-display';
    canvasContainer.appendChild(menuDisplayDiv);
    return canvasContainer;
};
// Append the created index container to the body of the HTML document
document.body.appendChild(createIndexContainer());
const canvasForm = document.getElementById('canvas-form');
const canvasListElement = document.getElementById('canvas-list');
const createCanvasButton = (canvasName, canvasId, hostId) => {
    const container = document.createElement('div');
    const btn = document.createElement('button');
    console.log('CANVASNAME: ' + canvasName);
    btn.innerHTML = canvasName;
    btn.addEventListener('click', () => enterCanvas(canvasId));
    container.appendChild(btn);
    if (hostId === localStorage.getItem('hostId')) {
        const rmvButton = document.createElement('button');
        rmvButton.innerHTML = 'remove';
        rmvButton.addEventListener('click', () => removeCanvas(canvasId));
        container.appendChild(rmvButton);
    }
    return container;
};
let websocket;
let canvasId;
export const wsSend = (eventLog) => {
    websocket.send(eventLog);
};
export const getCanvasId = () => {
    return canvasId;
};
const enterCanvas = async (id) => {
    fetch(`/canvas/${id}`)
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        if (data.status === 200) {
            // open canvas
            // Disable overview - html
            document.getElementById('index-container').style.display = 'none';
            document.body.appendChild(createCanvasContainer());
            // set current canvasId
            canvasId = id;
            //establisch websocket connection
            websocket = wsInstance(id);
            wsConnection(websocket, id);
            // render canvas - html
            // now init canvas logic
            init.init();
            createIndexContainer;
        }
        else {
            console.log('Cant open canvas');
        }
    });
};
const removeCanvas = async (id) => {
    fetch(`/canvas/remove/${id}`)
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        if (data.status === 200) {
            document.getElementById(data.id).remove();
        }
        else {
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
            console.log(canvasList);
            // Loop through the canvasList and create list items
            const listItems = canvasList.map((canvas) => {
                const liContainer = document.createElement('li');
                liContainer.style.width = '200px';
                liContainer.style.margin = '2px';
                liContainer.id = canvas.canvas_id;
                const listItem = createCanvasButton(canvas.name, canvas.canvas_id, canvas.host_id);
                liContainer.appendChild(listItem);
                return liContainer;
            });
            // Append the list items to the canvasListElement
            listItems.forEach((listItem) => {
                canvasListElement.appendChild(listItem);
            });
        }
        else {
            // Handle the error case
            console.error(data.message);
        }
    })
        .catch((error) => {
        console.error('An error occurred:', error);
    });
};
const createCanvasInstance = async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    const formData = new FormData(canvasForm);
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
        console.log('BODY');
        console.log(body);
        const btn = createCanvasButton(body.msg.name, body.msg.canvasId, body.msg.hostId);
        canvasListElement.appendChild(btn);
        // Refresh the page or perform other actions
    }
    else {
        // Handle error
        console.error('Form submission failed');
    }
};
/* init */
canvasForm.addEventListener('submit', createCanvasInstance);
fetchCanvases();
