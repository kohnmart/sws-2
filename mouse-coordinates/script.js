//define render-View
var width = 500, height = 500;
var render = document.getElementById('render_view');
render.style.width = width + 'px';
render.style.height = height + 'px';
render.style.backgroundColor = 'grey';
//define coordinates
var coordinates = document.getElementById('coordinates_rt_display');
var list = document.getElementById('coordinates_list');
var mouseX, mouseY;
document.addEventListener('mousemove', function (e) {
    (mouseX = e.clientX, mouseY = e.clientY);
    if (mouseX <= width && mouseY <= height) {
        coordinates.style.display = 'block';
        coordinates.textContent = "X: ".concat(mouseX, " || Y: ").concat(mouseY);
    }
    else {
        coordinates.style.display = 'none';
    }
});
document.addEventListener('click', function () {
    var item = document.createElement('li');
    item.innerHTML = "(MouseX: ".concat(mouseX, " || MouseY: ").concat(mouseY, ")");
    list.appendChild(item);
});
