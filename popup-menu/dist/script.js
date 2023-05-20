import menuApi from './menuApi.js';
const setupContextMenu = (menuApi) => {
    const menu = menuApi.createMenu();
    const mItem1 = menuApi.createItem('I 1', (m) => {
        console.log(m);
        m.hide();
    });
    const mItem2 = menuApi.createItem('I 2', (m) => {
        console.log(m);
    });
    const mT1 = menuApi.createSeparator();
    const mItem3 = menuApi.createItem('I 3', (m) => {
        m.hide();
    });
    menu.addItem(mItem1, mItem2, mT1, mItem3);
    return menu;
};
const menu = setupContextMenu(menuApi);
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    let { clientX: x, clientY: y } = e;
    menu.show(x, y);
});
document.addEventListener('click', (e) => {
    let { clientX: x, clientY: y } = e;
    const dynamicItem = menuApi.createItem('II 5', (m) => {
        console.log('wow');
        m.hide();
    });
    menu.addItem(dynamicItem);
    menu.addItemAt(dynamicItem, 2);
    menu.show(x, y);
    menu.removeItem(dynamicItem);
});
