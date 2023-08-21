import { canvasSubmission, fetchCanvases, joinCanvas } from '../index.js';
import {
  createCanvasContainer,
  createIndexContainer,
  createListContainer,
} from '../components/contextContainer.js';
import { canvasInit } from '../../init/canvasInit.js';

const mainContainer = document.body;
let indexContainer: HTMLDivElement;
let canvasContainer: HTMLDivElement;
// URL-Handler, um den Inhalt basierend auf der URL zu aktualisieren
export const handleURLLocation = () => {
  const currentURL = window.location.pathname; // Aktuelle URL ohne Domain
  if (currentURL === '/') {
    // Laden Sie den Inhalt für die Übersichtsseite
    loadOverviewContent();
  } else if (currentURL.startsWith('/canvas/')) {
    // Extrahieren Sie die Canvas-ID aus der URL
    const canvasId = currentURL.split('/canvas/')[1];
    // Laden Sie den Inhalt für die Zeichenfläche mit der Canvas-ID
    loadCanvasContent(canvasId);
  }
};

// Funktionen zum Laden von Inhalten (nur beispielhaft)
const loadOverviewContent = async () => {
  if (canvasContainer) {
    mainContainer.removeChild(canvasContainer);
  }
  indexContainer = createIndexContainer(); // Assign the created index container
  mainContainer.appendChild(indexContainer);

  /* loading canvases */
  const list = await fetchCanvases();

  const listItems = createListContainer(list);
  const canvasListElement = document.getElementById('canvas-list');
  // Append the list items to the canvasListElement
  listItems.forEach((listItem: HTMLElement) => {
    canvasListElement.appendChild(listItem);
  });

  const canvasForm = document.getElementById('canvas-form');
  canvasForm.addEventListener('submit', canvasSubmission);
};

const loadCanvasContent = async (canvasId: string) => {
  const res = await joinCanvas(canvasId);
  if (res) {
    canvasContainer = createCanvasContainer();
    if (indexContainer) {
      mainContainer.removeChild(indexContainer);
    }
    mainContainer.appendChild(canvasContainer);
    canvasInit();
  }
};

// Event-Handler für das popstate-Ereignis
window.addEventListener('popstate', function (event) {
  // Rufen Sie den URL-Handler auf, um den Inhalt basierend auf der aktuellen URL zu aktualisieren
  handleURLLocation();
});
