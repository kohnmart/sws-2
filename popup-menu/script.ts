import { MenuApi, Item } from './menuApi.js';

const setupContextMenu = (): MenuApi => {
  const menu = MenuApi.createMenu();
  const mItem1 = MenuApi.createItem('I 1', (m: Item) => {
    console.log(m);
    m.hide();
  });

  const mItem2 = MenuApi.createItem('I 2', (m: Item) => {
    console.log(m);
  });

  const mT1 = MenuApi.createSeparator();

  const mItem3 = MenuApi.createItem('I 3', (m: Item) => {
    m.hide();
  });

  menu.addItem(mItem1, mItem2, mT1, mItem3);

  return menu;
};

const menu = setupContextMenu();

document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  let { clientX: x, clientY: y } = e;
  menu.show(x, y);
});

document.addEventListener('click', (e) => {
  let { clientX: x, clientY: y } = e;
  const dynamicItem = MenuApi.createItem('II 5', (m) => {
    console.log('wow');
    m.hide();
  });
  menu.addItem(dynamicItem);
  menu.addItemAt(dynamicItem, 2);
  menu.show(x, y);
  menu.removeItem(dynamicItem);
});
