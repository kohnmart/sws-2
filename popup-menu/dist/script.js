var _a;
import MenuApi from './menuApi.js';
const setupContextMenu = (menuApi) => {
    const menu = menuApi.createMenu();
    const mItem1 = menuApi.createItem('I 1', (m) => {
        console.log('Test');
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
document.addEventListener('click', (e) => {
    e.preventDefault();
    let { clientX: x, clientY: y } = e;
    menu.show(x, y);
});
(_a = document.getElementById('dynamic-item')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
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
