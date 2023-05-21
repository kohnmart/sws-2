let list: HTMLElement;

const createMenu = (): any => {
  list = document.createElement('ul');
  // list base-style-configuration
  list.style.display = 'none';
  list.style.position = 'absolute';
  list.style.left = '0px';
  list.style.top = '0px';
  list.style.flexDirection = 'column';
  list.style.alignItems = 'center';
  list.style.justifyContent = 'center';
  list.style.height = 'auto';
  list.style.width = 'auto';
  // optional styling
  list.style.backgroundColor = 'grey';
  list.style.textAlign = 'center';
  list.style.padding = '10px';

  // append to root div
  document.getElementById('display')?.appendChild(list);
  return { list, addItem, addItemAt, removeItem, show };
};

const createItem = (
  item_content: string,
  _callback: (item: Item) => void
): Item => {
  const element = document.createElement('li');
  element.style.listStyle = 'none';
  element.style.margin = '5px 0px';
  element.innerText = item_content;
  return new Item(element);
};

const addItem = (...items: Item[]) => {
  items.forEach((item) => {
    list.appendChild(item.element);
  });
};

const addItemAt = (item: Item, targetIndex: number) => {
  // Ref: https://www.w3schools.com/JSREF/met_node_replacechild.asp
  const element = list.children[targetIndex];
  list.replaceChild(item.element, list.children[targetIndex]);
  list.appendChild(element);
};

const removeItem = (item: Item) => {
  list.removeChild(item.element);
};

const createSeparator = (): Item => {
  const separator: HTMLElement = document.createElement('hr');
  return new Item(separator);
};

const show = (x: Number, y: Number): void => {
  list.style.display = 'block';
  list.style.transform = `translate(${x}px, ${y}px)`;
};

const hide = (): void => {
  list.style.display = 'none';
};

class Item {
  element: HTMLElement;
  constructor(element: HTMLElement) {
    this.element = element;
  }

  hide(): void {
    this.element.style.display = 'none';
  }

  show(): void {
    this.element.style.display = 'block';
  }
}

export default {
  createMenu,
  createItem,
  createSeparator,
  hide,
};

export { Item };
