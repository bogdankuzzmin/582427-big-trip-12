import {getRandomElement, getRandomInteger} from "../utils/common.js";
import {generateDate, getPrepositon} from "../utils/event.js";
import {EVENT_ACTION} from "../const.js";
import randomId from "random-id";

const MAX_SHIFT_EVENT_MINUTES = 150;
const DAY_GAP = 5;
const maxShiftStartEventMinutes = DAY_GAP * 24 * 60;

export const generateEvent = (tripOffers, tripDestination) => {
  const id = randomId(3);
  const type = getRandomElement(EVENT_ACTION.types);
  const offers = tripOffers.find((it) => it.type === type).offers;
  const destination = getRandomElement(tripDestination);
  const price = getRandomInteger(10, 50) * 10;
  const startDate = generateDate(maxShiftStartEventMinutes);
  const endDate = generateDate(MAX_SHIFT_EVENT_MINUTES, startDate);
  const isFavorite = Boolean(getRandomInteger(0, 1));

  return {
    id,
    action: {
      type,
      preposition: getPrepositon(type),
    },
    price,
    offers,
    startDate,
    endDate,
    isFavorite,
    destination,
  };
};
