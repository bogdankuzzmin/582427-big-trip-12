export const sortTypeEvent = (eventA, eventB) => {
  return eventA.city.localeCompare(eventB.city);
};

export const sortTypeTime = (timeA, timeB) => {
  return timeA.startDate - timeB.startDate;
};

export const sortTypePrice = (priceA, priceB) => {
  return priceA.price - priceB.price;
};

