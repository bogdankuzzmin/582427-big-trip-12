import {getRandomElement, getRandomInteger} from "../utils/common.js";
import {generateDate} from "../utils/event.js";
import {CITIES, EVENT_ACTION} from "../const.js";
import {generateOffers} from "../mock/offers.js";
import randomId from "random-id";

const MAX_SHIFT_EVENT_MINUTES = 150;
const DAY_GAP = 5;
const maxShiftStartEventMinutes = DAY_GAP * 24 * 60;

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

export const generateEvent = () => {
  const eventId = randomId(3);
  const action = generateAction();
  const city = getRandomElement(CITIES);
  const price = getRandomInteger(10, 50) * 10;
  const offers = generateOffers();
  const startDate = generateDate(maxShiftStartEventMinutes);
  const endDate = generateDate(MAX_SHIFT_EVENT_MINUTES, startDate);
  const isFavorite = Boolean(getRandomInteger(0, 1));

  return {
    eventId,
    action,
    city,
    price,
    offers,
    startDate,
    endDate,
    isFavorite,
  };
};
