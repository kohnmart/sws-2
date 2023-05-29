"use strict";
/* create render-view */
const width = 500;
const height = 500;
const renderView = document.getElementById('render-view');
renderView.style.width = width + 'px';
renderView.style.height = height + 'px';
renderView.style.backgroundColor = 'grey';
/* store dynamic mouse-coordinates */
let mX, mY;
/* get span-element to display real-time mouse-coordinates */
const coordinates = document.getElementById('coordinates-rt-display');
/* display mouse-coordinates if target is 'render-view' */
document.addEventListener('mousemove', (e) => {
    ({ clientX: mX, clientY: mY } = e);
    const target = e.target;
    if (target.id == 'render-view') {
        coordinates.style.display = 'block';
        coordinates.textContent = `X: ${mX} || Y: ${mY}`;
    }
    else {
        coordinates.style.display = 'none';
    }
});
/* create list-element to store mouse-coordinates */
const list = document.getElementById('coordinates-list');
/* create new list element with current mouse-coordinates */
document.addEventListener('click', () => {
    const item = document.createElement('li');
    item.innerHTML = `(X: ${mX} || Y: ${mY})`;
    list.appendChild(item);
});
