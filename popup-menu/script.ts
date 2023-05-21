import menuApi, { Item, MenuApi } from './menuApi.js';

const setupContextMenu = (menuApi: MenuApi) => {
  const menu = menuApi.createMenu();
  const mItem1 = menuApi.createItem('I 1', (m: Item) => {
    console.log(m);
    m.hide();
  });

  const mItem2 = menuApi.createItem('I 2', (m: Item) => {
    console.log(m);
  });

  const mT1 = menuApi.createSeparator();

  const mItem3 = menuApi.createItem('I 3', (m: Item) => {
    m.hide();
  });

  menu.addItems(mItem1, mItem2);
  menu.addItem(mT1);
  menu.addItem(mItem3);

  return menu;
};

const menu = setupContextMenu(menuApi);

document.addEventListener('click', (e) => {
  e.preventDefault();
  let { clientX: x, clientY: y } = e;
  menu.show(x, y);
});

document.addEventListener('click', (e) => {
  e.preventDefault();
  let { clientX: x, clientY: y } = e;
  const dynamicItem = menuApi.createItem('II 5', (m: Item) => {
    console.log('wow');
    m.hide();
  });
  menu.addItemAt(dynamicItem, 2);
  menu.show(x, y);
  menu.removeItem(dynamicItem);
});
