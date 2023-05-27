"use strict";
/* Create render-view */
const width = 500;
const height = 500;
const render = document.getElementById('render-view');
render.style.width = width + 'px';
render.style.height = height + 'px';
render.style.backgroundColor = 'grey';
/* Get span-element to display real-time mouse-coordinates */
const coordinates = document.getElementById('coordinates-rt-display');
/* Create list-element to store mouse-coordinates on event */
const list = document.getElementById('coordinates-list');
/* Store dynamic mouse-coordinates */
let mouseX, mouseY;
/* Display mouse-coordinates if cursor is in given range */
document.addEventListener('mousemove', (e) => {
    ({ clientX: mouseX, clientY: mouseY } = e);
    if (mouseX <= width && mouseY <= height) {
        coordinates.style.display = 'block';
        coordinates.textContent = `X: ${mouseX} || Y: ${mouseY}`;
    }
    else {
        coordinates.style.display = 'none';
    }
});
/* Create new list element with current mouse-coordinates */
document.addEventListener('click', () => {
    const item = document.createElement('li');
    item.innerHTML = `(MouseX: ${mouseX} || MouseY: ${mouseY})`;
    list.appendChild(item);
});
