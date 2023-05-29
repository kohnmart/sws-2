import MenuApi from './menuApi.js';
const setupContextMenu = (menuApi) => {
    const menu = menuApi.createMenu();
    const mItem1 = menuApi.createItem('I 1', (m) => {
        m.hide();
    });
    const mItem2 = menuApi.createItem('I 2', (m) => {
        console.log(m);
    });
    const mT1 = menuApi.createSeparator();
    const mItem3 = menuApi.createItem('I 3', (m) => {
        m.hide();
    });
    menu.addItems(mItem1, mItem2);
    menu.addItem(mT1);
    menu.addItem(mItem3);
    return menu;
};
const menu = setupContextMenu(new MenuApi());
/* apply preventDefault to all child-events of main */
const mainContainer = document.getElementsByTagName('main')[0];
mainContainer.addEventListener('click', (event) => {
    const { clientX: x, clientY: y } = event;
    menu.show(x, y);
});
/* dynamic-item event */
const headerContainer = document.getElementsByTagName('header')[0];
headerContainer.addEventListener('click', (event) => {
    const { clientX: x, clientY: y } = event;
    const dynamicItem = menu.createItem('II 5', (m) => {
        m.hide();
    });
    // Order after the call : I 1 , I 2 , dynamicItem , Sep , I 3
    menu.addItemAt(dynamicItem, 2);
    menu.show(x, y);
    menu.removeItem(dynamicItem);
});
