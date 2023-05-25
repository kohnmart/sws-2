/* Create render-view */
const width: Number = 500,
  height: Number = 500;
const render: HTMLElement = document.getElementById('render_view')!;
render.style.width = width + 'px';
render.style.height = height + 'px';
render.style.backgroundColor = 'grey';

/* Get span-element to display real-time mouse-coordinates */
const coordinates: HTMLElement = document.getElementById(
  'coordinates_rt_display'
)!;

/* Create list-element to store mouse-coordinates on event */
const list: HTMLElement = document.getElementById('coordinates_list')!;

/* Store dynamic mouse-coordinates */
let mouseX: Number, mouseY: Number;

/* Display mouse-coordinates if cursor is in given range */
document.addEventListener('mousemove', (e) => {
  ({ clientX: mouseX, clientY: mouseY } = e);

  if (mouseX <= width && mouseY <= height) {
    coordinates.style.display = 'block';
    coordinates.textContent = `X: ${mouseX} || Y: ${mouseY}`;
  } else {
    coordinates.style.display = 'none';
  }
});

/* Create new list element with current mouse-coordinates */
document.addEventListener('click', () => {
  const item: HTMLElement = document.createElement('li');
  item.innerHTML = `(MouseX: ${mouseX} || MouseY: ${mouseY})`;
  list.appendChild(item);
});
