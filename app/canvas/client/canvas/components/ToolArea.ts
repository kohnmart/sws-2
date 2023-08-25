import { IShapeFactory } from '../../types/shape.js';

export class ToolArea {
  private selectedShape: IShapeFactory = undefined;
  constructor(shapesSelector: IShapeFactory[], menu: Element) {
    const list = [];
    shapesSelector.forEach((shape) => {
      const listItem = document.createElement('li');
      listItem.innerText = shape.label;
      menu.appendChild(listItem);
      list.push(listItem);

      listItem.addEventListener('click', () => {
        selectTool.call(this, shape, listItem);
      });
    });

    function selectTool(shape: IShapeFactory, activeListItem: HTMLElement) {
      // remove class from all elements
      list.forEach((item) => {
        item.classList.remove('marked');
      });

      if (shape.hasOwnProperty('shapeManager')) {
        this.selectedShape = shape;
      } else {
        this.selectedShape = shape;
      }
      // add class to the one that is selected currently
      activeListItem.classList.add('marked');
    }
  }

  getSelectedTool(): IShapeFactory {
    return this.selectedShape;
  }
}
