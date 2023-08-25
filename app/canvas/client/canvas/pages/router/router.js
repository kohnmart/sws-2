import { canvasSubmission, fetchCanvases, joinCanvas } from '../index.js';
import { createCanvasContainer, createIndexContainer, createListContainer, } from '../components/contextContainer.js';
import { canvasInit } from '../../init/canvasInit.js';
const mainContainer = document.body;
let indexContainer;
let canvasContainer;
// URL Handler to update page content based on URL
export const handleURLLocation = () => {
    const currentURL = window.location.pathname;
    if (currentURL === '/') {
        loadOverviewContent();
    }
    else if (currentURL.startsWith('/canvas/')) {
        const canvasId = currentURL.split('/canvas/')[1];
        loadCanvasContent(canvasId);
    }
};
// Load content
const loadOverviewContent = async () => {
    if (canvasContainer) {
        mainContainer.removeChild(canvasContainer);
    }
    indexContainer = createIndexContainer(); // Assign the created index container
    mainContainer.appendChild(indexContainer);
    // Fetch canvases list
    const list = await fetchCanvases();
    const listItems = createListContainer(list);
    const canvasListElement = document.getElementById('canvas-list');
    // Append the list items to the canvasListElement
    listItems.forEach((listItem) => {
        canvasListElement.appendChild(listItem);
    });
    const canvasForm = document.getElementById('canvas-form');
    canvasForm.addEventListener('submit', canvasSubmission);
};
const loadCanvasContent = async (canvasId) => {
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
window.addEventListener('popstate', function (event) {
    handleURLLocation();
});
