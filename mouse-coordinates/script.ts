//define render-View
const width: Number = 500, height: Number = 500;
const render: HTMLElement = document.getElementById("render_view")!;
render.style.width = width + "px";
render.style.height = height + "px";
render.style.backgroundColor = "grey";

//define coordinates
const coordinates: HTMLElement = document.getElementById("coordinates_rt_display")!;
const list: HTMLElement = document.getElementById("coordinates_list")!;
let mouseX: Number, mouseY: Number;

document.addEventListener('mousemove', (e) => {
  ({ clientX: mouseX, clientY: mouseY } = e);

  if (mouseX <= width && mouseY <= height) {
    coordinates.style.display = "block";
    coordinates.querySelector("p")!.innerHTML = `X: ${mouseX} || Y: ${mouseY}`;
  }
  else {
    coordinates.style.display = "none";
  }
});

document.addEventListener("click", () => {
  const item: HTMLElement = document.createElement('li');
  item.innerHTML = `(MouseX: ${mouseX} || MouseY: ${mouseY})`;
  list.appendChild(item);
});