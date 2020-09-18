export const MAX_EVENT_OFFERS = 3;

export const EVENT_ACTION = {
  types: [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
  ],
  activities: [
    `Check-in`,
    `Sightseeing`,
    `Restaurant`,
  ],
};

export const typeToEmoji = {
  'TAXI': `🚕`,
  'BUS': `🚌`,
  'TRAIN': `🚂`,
  'SHIP': `🛳`,
  'TRANSPORT': `🚊`,
  'DRIVE': `🚗`,
  'FLIGHT': `✈️`,
  'CHECK-IN': `🏨`,
  'SIGHTSEEING': `🏛`,
  'RESTAURANT': `🍴`,
};

export const eventTypes = EVENT_ACTION.types.concat(EVENT_ACTION.activities);

export const CITIES = [
  `Hawaii`,
  `Chicago`,
  `Tokyo`,
  `Valencia`,
  `Amsterdam`,
  `Saint-Petersburg`,
];

export const InsertPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  ERROR: `ERROR`,
};

export const MenuItem = {
  ADD_EVENT: `add-event`,
  EVENTS: `table`,
  STATS: `stats`
};

export const LoadMessage = {
  LOADING: `Loading...`,
  ERROR: `Couldn't load data, try again later`,
};
