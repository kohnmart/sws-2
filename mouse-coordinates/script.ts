/* create render-view */
const width: Number = 500;
const height: Number = 500;
const renderView: HTMLElement = document.getElementById('render-view')!;
renderView.style.width = width + 'px';
renderView.style.height = height + 'px';
renderView.style.backgroundColor = 'grey';

/* store dynamic mouse-coordinates */
let mX: Number, mY: Number;

/* get span-element to display real-time mouse-coordinates */
const coordinates: HTMLElement = document.getElementById(
  'coordinates-rt-display'
)!;

/* display mouse-coordinates if target is 'render-view' */
document.addEventListener('mousemove', (e) => {
  ({ clientX: mX, clientY: mY } = e);
  const target = e.target as HTMLElement;
  if (target.id == 'render-view') {
    coordinates.style.display = 'block';
    coordinates.textContent = `X: ${mX} || Y: ${mY}`;
  } else {
    coordinates.style.display = 'none';
  }
});

/* create list-element to store mouse-coordinates */
const list: HTMLElement = document.getElementById('coordinates-list')!;

/* create new list element with current mouse-coordinates */
document.addEventListener('click', () => {
  const item: HTMLElement = document.createElement('li');
  item.innerHTML = `(X: ${mX} || Y: ${mY})`;
  list.appendChild(item);
});
