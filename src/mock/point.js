const MIN_OFFER_COST = 1;
const MAX_OFFER_COST = 300;

const MIN_COUNT_OFFERS_FOR_TYPE = 1;
const MAX_COUNT_OFFERS_FOR_TYPE = 5;

const MIN_POINT_COST = 1;
const MAX_POINT_COST = 1000;

const MAX_TRIP_DAYS_FROM = 10; // для генерации в моках случайной начальной даты
const MAX_EVENT_DAYS = 2; // максимальное количество дней одного события, для моков
const ONE_DAY_TIME = 86400000; // время в мс, для моков


const eventTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
const cities = [`Amsterdam`, `Geneva`, `Chamonix`, `Prague`, `Saint Petersburg`];

// Моки
const offerTitles = [`Upgrade to a business class`, `Choose the radio station`, `Add luggage`, `Switch to comfort`, `Book tickets`, `Lunch in city`, `Rent a car`, `Order Uber`, `Add breakfast`];

const descrtiption = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomArray = (array, min, max) => {
  if (max === undefined) {
    max = min;
  }
  const randomNumber = getRandomIntegerNumber(min, max);
  const copyArray = array.slice();
  const randomArr = [];

  for (let i = 0; i < randomNumber; i++) {
    const randomIndex = getRandomIntegerNumber(0, copyArray.length - 1);
    randomArr.push(copyArray[randomIndex]);
    copyArray.splice(randomIndex, 1);
  }
  return randomArr;
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max + 1 - min));
};

// const addPriceToOffers = () => {
//   return (
//     {
//       "title": offerTitles[getRandomIntegerNumber(0, offerTitles.length)],
//       "price": getRandomIntegerNumber(MIN_OFFER_COST, MAX_OFFER_COST),
//     }
//   );
// };

const getSetOfOffers = () => {
  const setOfOffers = getRandomArray(offerTitles, 1, 5).map((title) => {
    return (
      {
        "title": title,
        "price": getRandomIntegerNumber(MIN_OFFER_COST, MAX_OFFER_COST),
      });
  });

  return setOfOffers;
};

const generateTypesWithOffers = () => { // функция создает массив объектов, где каждому типу точки соответствует определенный набор дополнительных опций
  const typesWithOffers = [];

  //const countOffers = getRandomIntegerNumber(MIN_COUNT_OFFERS_FOR_TYPE, MAX_COUNT_OFFERS_FOR_TYPE);



  for (const item of eventTypes) {

    typesWithOffers.push(
        {
          "type": item,
          "offers": getSetOfOffers(),
        }
    );
  }
  return typesWithOffers;
};

const typesWithOffers = generateTypesWithOffers();

console.log(typesWithOffers);

// const generateRandomOffers = (titles, min, max) => {
//   const randomTitles = getRandomArray(offerTitles, min, max);
//   const randomOffers = [];
//   for (const title of randomTitles) {
//     randomOffers.push(
//         {
//           "title": title,
//           "price": getRandomIntegerNumber(MIN_OFFER_COST, MAX_OFFER_COST),
//         }
//     );
//   }
//   return randomOffers;
// };

const generatePhotos = (count) => {
  return new Array(count)
  .fill(``)
  .map(() => {
    return `http://picsum.photos/248/152?r=${Math.random()}`;
  });
};

// const getTypeWithOffers = () => { // функция создает массив, где каждому типу точки соответствует определенный набор дополнительных опций
//
// };

const generateEvent = () => {
  const dateFrom = new Date(Date.now() + getRandomIntegerNumber(0, ONE_DAY_TIME * MAX_TRIP_DAYS_FROM));
  const type = getRandomArrayItem(eventTypes);
  const typeWithOffers = typesWithOffers.find((item) => {
    return item.type === type;
  });
//  const offers = getRandomArray(typeWithOffers.offers, typeWithOffers.offers.length);

  return {
    type,
    destination: {
      name: getRandomArrayItem(cities),
      description: getRandomArray(descrtiption, 1, 6).join(` `),
      pictures: generatePhotos(getRandomIntegerNumber(1, 6)),
    },
    offers: getRandomArray(typeWithOffers.offers, typeWithOffers.offers.length),
    dateFrom,
    dateTo: new Date(dateFrom.getTime() + getRandomIntegerNumber(0, ONE_DAY_TIME * MAX_EVENT_DAYS)),
    price: getRandomIntegerNumber(MIN_POINT_COST, MAX_POINT_COST),
    isFavorite: Math.random() > 0.5,
  };
};

const generateEvents = (count) => {
  return new Array(count)
  .fill(``)
  .map(generateEvent);
};

export {generateEvents};
