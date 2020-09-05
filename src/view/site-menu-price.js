import {MAX_EVENT_OFFERS} from "../const.js";
import AbstractView from "./abstract.js";
const countPrice = (events) => {
  if (events.length === 0) {
    return `0`;
  }

  let price = 0;

  events.forEach((event) => {
    price += event.price;

    return event.offers
      .slice(0, MAX_EVENT_OFFERS)
      .filter((eventOffer) => {
        if (eventOffer.isChecked === true) {
          price += eventOffer.price;
        }
      });
  });

  return price;
};

const createMenuPriceTemplate = (events) => {
  const price = countPrice(events);

  return (
    `<p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
     </p>`
  );
};

export default class SiteMenuPrice extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
  }

  get template() {
    return createMenuPriceTemplate(this._events);
  }
}
