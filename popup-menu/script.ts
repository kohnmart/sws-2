import MenuApi from './menuApi.js';

const setupContextMenu = (menuApi: MenuApi) => {
  const menu = menuApi.createMenu();
  const mItem1 = menuApi.createItem('I 1', (m: MenuApi) => {
    m.hide();
  });

  const mItem2 = menuApi.createItem('I 2', (m: MenuApi) => {
    console.log(m);
  });

  const mT1 = menuApi.createSeparator();

  const mItem3 = menuApi.createItem('I 3', (m: MenuApi) => {
    m.hide();
  });

  menu.addItems(mItem1, mItem2);
  menu.addItem(mT1);
  menu.addItem(mItem3);

  return menu;
};

const menu = setupContextMenu(new MenuApi());

document.addEventListener('click', (e) => {
  e.preventDefault();
  let { clientX: x, clientY: y } = e;
  menu.show(x, y);
});

document.getElementById('dynamic-item')?.addEventListener('click', (e) => {
  e.preventDefault();
  let { clientX: x, clientY: y } = e;
  const dynamicItem = menu.createItem('II 5', () => {
    console.log('wow');
    menu.hide();
  });
  menu.addItemAt(dynamicItem, 2);
  menu.show(x, y);
  menu.removeItem(dynamicItem);
});
