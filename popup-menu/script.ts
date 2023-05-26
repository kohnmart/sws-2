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

/* Span Element to display event-handling on menu-display-state condition */
const consoleState = document.getElementById('console-state');

/* Apply preventDefault to all child-events of parent-div */
const popupContainer = document.getElementById('popup-container');
popupContainer?.addEventListener('click', (event) => {
  event.preventDefault();
  const { clientX: x, clientY: y } = event;
  menu.show(x, y);
});

/* If menu is displayed => all other events close menu onclick */
const othersContainer = document.getElementById('others-container');
othersContainer?.addEventListener('click', () => {
  if (menu.isdisplayed) {
    consoleState!.innerText = `menu display is ${menu.isdisplayed}, using default menu-event`;
    menu.hide();
  }
});

/* Example button to demonstrate event-handling on menu-display-state condition */
const buttonLinkTo = document.getElementById('button-link-to');
buttonLinkTo?.addEventListener('click', () => {
  consoleState!.innerText = `menu display is ${menu.isdisplayed}, using custom event`;
});

/* open-menu event */
document.getElementById('menu-open')!.addEventListener('click', (e) => {
  const { clientX: x, clientY: y } = e;
  menu.show(x, y);
});

/* dynamic-item event */
document.getElementById('item-dynamic')!.addEventListener('click', (e) => {
  const { clientX: x, clientY: y } = e;
  const dynamicItem = menu.createItem('II 5', (m: MenuApi) => {
    console.log('wow');
    m.hide();
  });
  // Order after the call : I 1 , I 2 , dynamicItem , Sep , I 3
  menu.addItemAt(dynamicItem, 2);
  menu.show(x, y);
  menu.removeItem(dynamicItem);
});
