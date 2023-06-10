import { Selector } from './Selector.js';
import { ShapeFactory } from './types.js';

export class ToolArea {
  private selectedShape: ShapeFactory = undefined;
  constructor(shapesSelector: ShapeFactory[], menu: Element) {
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

    function selectTool(shape: ShapeFactory, activeListItem: HTMLElement) {
      // remove class from all elements
      list.forEach((item) => {
        item.classList.remove('marked');
      });

      if (shape.hasOwnProperty('shapeManager')) {
        this.selectedShape = shape;
        Selector.isSelectionMode = false;
      } else {
        this.selectedShape = shape;
        Selector.isSelectionMode = true;
      }
      // add class to the one that is selected currently
      activeListItem.classList.add('marked');
    }
  }

  getSelectedTool(): ShapeFactory {
    return this.selectedShape;
  }
}
