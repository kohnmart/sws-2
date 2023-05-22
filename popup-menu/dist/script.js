import menuApi from './menuApi.js';
const setupContextMenu = (menuApi) => {
    const menu = menuApi.createMenu();
    const mItem1 = menuApi.createItem('I 1', () => {
        menu.hide();
    });
    const mItem2 = menuApi.createItem('I 2', (m) => {
        console.log(m);
    });
    const mT1 = menuApi.createSeparator();
    const mItem3 = menuApi.createItem('I 3', () => {
        menu.hide();
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
    const dynamicItem = menuApi.createItem('II 5', () => {
        console.log('wow');
        menu.hide();
    });
    menu.addItemAt(dynamicItem, 2);
    menu.show(x, y);
    menu.removeItem(dynamicItem);
});
