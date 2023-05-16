"use strict";
const width = 500, height = 500;
const render = document.getElementById("render_view");
render.style.width = width + "px";
render.style.height = height + "px";
render.style.backgroundColor = "grey";
const coordinates = document.getElementById("coordinates_rt_display");
let mouseX, mouseY;
document.addEventListener('mousemove', (e) => {
    ({ clientX: mouseX, clientY: mouseY } = e);
    if (mouseX <= width && mouseY <= height) {
        coordinates.style.display = "block";
        coordinates.querySelector("p").innerHTML = `X: ${mouseX} || Y: ${mouseY}`;
    }
    else {
        coordinates.style.display = "none";
    }
});
const list = document.getElementById("coordinates_list");
document.addEventListener("click", () => {
    const item = document.createElement('li');
    item.innerHTML = `(MouseX: ${mouseX} || MouseY: ${mouseY})`;
    list.appendChild(item);
});
