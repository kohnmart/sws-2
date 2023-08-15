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
