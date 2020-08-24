import moment from "moment";

export const sortTypeEvent = (eventA, eventB) => {
  return eventA.startDate - eventB.startDate;
};

export const sortTypeTime = (timeA, timeB) => {
  const durationA = moment(timeA.endDate).diff(moment(timeA.startDate));
  const durationB = moment(timeB.endDate).diff(moment(timeB.startDate));
  return durationB - durationA;
};

export const sortTypePrice = (priceA, priceB) => {
  return priceB.price - priceA.price;
};

