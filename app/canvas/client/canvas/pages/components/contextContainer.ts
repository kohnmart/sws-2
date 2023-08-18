import { joinCanvas, deleteCanvas, removeCanvas } from '../index.js';
import { T_CanvasData } from '../../../api/fetch.js';

export const createIndexContainer = () => {
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

export const setActiveIndexContainer = (isActive: boolean) => {
  if (isActive) {
    document.getElementById('index-container').style.display = 'block';
  } else {
    document.getElementById('index-container').style.display = 'none';
  }
};

export const createCanvasContainer = (leaveCanvasEvent: EventListener) => {
  const canvasContainer = document.createElement('div');
  canvasContainer.id = 'canvas-container';

  const returnButton = document.createElement('button');
  returnButton.addEventListener('click', leaveCanvasEvent);
  returnButton.innerText = 'Leave Canvas';
  canvasContainer.appendChild(returnButton);

  const paragraph = document.createElement('p');
  paragraph.textContent = ` Wählen Sie auf der linken Seite Ihr Zeichwerkzeug aus. 
    Haben Sie eines ausgewählt, können Sie mit der Maus die entsprechenden Figuren zeichnen. 
    Typischerweise, indem Sie die Maus drücken, dann mit gedrückter Maustaste die Form bestimmen, 
    und dann anschließend die Maustaste loslassen. `;
  canvasContainer.appendChild(paragraph);

  const toolsList = document.createElement('ul');
  toolsList.className = 'tools';
  canvasContainer.appendChild(toolsList);

  const canvas = document.createElement('canvas');
  canvas.id = 'drawArea';
  canvas.width = 900;
  canvas.height = 800;
  canvasContainer.appendChild(canvas);

  const menuDisplayDiv = document.createElement('div');
  menuDisplayDiv.id = 'menu-display';
  canvasContainer.appendChild(menuDisplayDiv);
  return canvasContainer;
};

export const setActiveCanvasContainer = (isActive: boolean) => {
  if (isActive) {
    document.getElementById('canvas-container').style.display = 'block';
  } else {
    document.getElementById('canvas-container').style.display = 'none';
  }
};

export const switchActiveContainer = (isIndexActive: boolean) => {
  setActiveIndexContainer(isIndexActive);
  setActiveCanvasContainer(!isIndexActive);
};

export const createListContainer = (
  canvases: T_CanvasData[]
): HTMLLIElement[] => {
  return canvases.map((canvas: T_CanvasData) => {
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
};

export const createCanvasButton = (
  canvasName: string,
  canvasId: string,
  hostId: string
) => {
  const container = document.createElement('div');
  const btn = document.createElement('button');
  btn.innerHTML = canvasName;
  btn.addEventListener('click', () => joinCanvas(canvasId));

  container.appendChild(btn);

  if (hostId === localStorage.getItem('hostId')) {
    /* dialog container */
    const dialogContainer = document.createElement('div');

    /* remove Button */
    const removeButton = document.createElement('button');

    /* confirm button */
    const confirmButton = document.createElement('button');
    confirmButton.innerHTML = 'confirm';
    confirmButton.addEventListener('click', () => deleteCanvas(canvasId));

    /* cancel button */
    const cancelButton = document.createElement('button');
    cancelButton.addEventListener('click', () => {
      dialogContainer.style.display = 'none';
      removeButton.style.display = 'block';
    });

    /* dialog container */
    dialogContainer.appendChild(confirmButton);
    dialogContainer.appendChild(cancelButton);
    dialogContainer.style.display = 'none';

    /* cancel button */
    cancelButton.innerHTML = 'cancel';
    removeButton.innerHTML = 'remove';
    removeButton.addEventListener('click', () => {
      removeCanvas(canvasId);
      dialogContainer.style.display = 'block';
      removeButton.style.display = 'none';
    });

    /* appends child nodes */
    container.appendChild(removeButton);
    container.appendChild(dialogContainer);
  }
  return container;
};
