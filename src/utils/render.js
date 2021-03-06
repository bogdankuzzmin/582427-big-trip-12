import {InsertPosition} from "../const.js";
import Abstract from "../view/abstract.js";

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.element;
  }

  if (child instanceof Abstract) {
    child = child.element;
  }

  switch (place) {
    case InsertPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case InsertPosition.BEFOREEND:
      container.append(child);
      break;
    case InsertPosition.AFTEREND:
      container.after(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.element;
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.element;
  }

  const parent = oldChild.parentElement;

  if (parent === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.element.remove();
  component.removeElement();
};
