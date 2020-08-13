import {getRandomElement, getRandomInteger, generateDate} from "../utils.js";
import {CITIES, EVENT_ACTION} from "../const.js";
import {generateOffers} from "../mock/offers.js";

const generateAction = () => {
  const type = getRandomElement(EVENT_ACTION.types);
  let preposition;

  if (Object.values(EVENT_ACTION.activities).includes(type)) {
    preposition = `in`;
  } else {
    preposition = `to`;
  }

  return {
    type,
    preposition,
  };
};

const MAX_SHIFT_EVENT_MINUTES = 1600;
const DAY_GAP = 5;
const maxShiftStartEventMinutes = DAY_GAP * 24 * 60;

export const generateEvent = () => {
  const action = generateAction();
  const city = getRandomElement(CITIES);
  const price = getRandomInteger(10, 50) * 10;
  const offers = generateOffers();
  const startDate = generateDate(maxShiftStartEventMinutes);
  const endDate = generateDate(MAX_SHIFT_EVENT_MINUTES, startDate);
  const isFavorit = Boolean(getRandomInteger(0, 1));

  return {
    action,
    city,
    price,
    offers,
    startDate,
    endDate,
    isFavorit,
  };
};
