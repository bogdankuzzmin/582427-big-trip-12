import {getRandomInteger, shuffleArray} from "../utils/common.js";
import {CITIES} from "../const.js";

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;

const DESCRIPTION_QUANTITY = {
  min: 1,
  max: 5,
};

const generateDescriptionText = () => {
  const splitText = DESCRIPTION.split(`. `);
  shuffleArray(splitText);

  let descriptionText = ``;
  const sentencesQuantity = getRandomInteger(DESCRIPTION_QUANTITY.min, DESCRIPTION_QUANTITY.max);

  for (let i = 0; i < sentencesQuantity; i++) {
    descriptionText += `${splitText[i]}. `;
  }

  return descriptionText;
};

const generatePhotos = () => {
  const photosQuantity = getRandomInteger(DESCRIPTION_QUANTITY.min, DESCRIPTION_QUANTITY.max);

  return new Array(photosQuantity)
    .fill()
    .map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
};

export const generateDestination = () => ({
  description: generateDescriptionText(),
  photos: generatePhotos(),
});

export const asd = () => {
  return CITIES.map((city) => ({
    city,
    description: generateDescriptionText(),
    photos: generatePhotos(),
  }));
};
