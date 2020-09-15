import {getRandomElement, getRandomInteger, shuffleArray} from "../utils/common.js";
import {generateDate, getOffers} from "../utils/event.js";
import {eventTypes} from "../const.js";
import randomId from "random-id";

const MAX_SHIFT_EVENT_MINUTES = 60 * 48;
const DAY_GAP = 5;

export const generateEvent = (tripOffers, tripDestination) => {
  const maxShiftStartEventMinutes = getRandomInteger(-DAY_GAP, DAY_GAP) * 24 * 60;

  const id = randomId(3);
  const type = getRandomElement(eventTypes);
  const offers = getOffers(tripOffers, type);
  const destination = getRandomElement(tripDestination);
  const price = getRandomInteger(10, 50) * 10;
  const startDate = generateDate(maxShiftStartEventMinutes);
  const endDate = generateDate(MAX_SHIFT_EVENT_MINUTES, startDate);
  const isFavorite = Boolean(getRandomInteger(0, 1));

  return {
    id,
    type,
    price,
    offers: shuffleArray(offers).slice(getRandomInteger(0, 5)),
    startDate,
    endDate,
    isFavorite,
    destination,
  };
};
