import {shuffleArray, getRandomInteger} from "../utils/common.js";

const OFFERS = [`Add luggae`, `Add meal`, `Choose seats`, `Travel by train`, `Rent a car`, `Lunch in city`, `Add breakfast`, `Order Uber`];

const MAX_OFFERS = {
  min: 0,
  max: 5,
};

const OFFER_PRICE = {
  min: 10,
  max: 250,
};

export const generateOffers = () => {
  const offers = shuffleArray(OFFERS)
    .slice(0, getRandomInteger(MAX_OFFERS.min, MAX_OFFERS.max));

  return offers.map((name) => ({
    name,
    price: getRandomInteger(OFFER_PRICE.min, OFFER_PRICE.max),
    isChecked: Boolean(getRandomInteger(0, 1)),
  }));
};
