import AbstractView from "./abstract.js";

const createMenuTemplate = () => {

  return (
    `<section class="trip-main__trip-info  trip-info">

    </section>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createMenuTemplate();
  }
}
