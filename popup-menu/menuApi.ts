let list: HTMLElement;

const createMenu = (): HTMLElement => {
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
  return list;
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

const createSeparator = (): Item => {
  const separator: HTMLElement = document.createElement('hr');
  return new Item(separator);
};

const addItemAt = (item: Item, targetIndex: number) => {
  const tempList = [...list.childNodes];

  const itemAtTarget = tempList[targetIndex];

  const currentIndex = tempList.findIndex((e) => e == item.element);

  tempList[targetIndex] = item.element;
  tempList[currentIndex] = itemAtTarget;
};

const removeItem = (item: Item) => {
  const temp = [...list.childNodes];
  const index = temp.findIndex((e) => e == item.element);
  temp.splice(index, 0);
  temp[index].remove();
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

interface Item {
  element: HTMLElement;
}

export default {
  createMenu,
  createItem,
  addItem,
  createSeparator,
  addItemAt,
  hide,
  show,
  removeItem,
};

export { Item };
