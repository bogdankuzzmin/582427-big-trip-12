import {insertPosition} from "../const.js";

export const render = (container, element, place) => {
  switch (place) {
    case insertPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case insertPosition.BEFOREEND:
      container.append(element);
      break;
    case insertPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
