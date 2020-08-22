export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (arr) => arr[(Math.random() * arr.length) | 0];

export const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());