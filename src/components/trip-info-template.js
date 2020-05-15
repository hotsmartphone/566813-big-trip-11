import {castTimeFormat, getShortDate} from "../utils.js";

const getTripDateRange = (from, to) => { // функция анализирует даты и выводит строку в соответствующем формате
  if ((from - to) === 0) {
    return getShortDate(from); // если путешествие длится один день - выводит в формате "MAY 18"
  } else if (from.getMonth() === to.getMonth()) {
    return `${getShortDate(from)}&nbsp;&mdash;&nbsp;${castTimeFormat(to.getDate())}`; // если путешествие происходит в одном месяце - выводит в формате "MAY 18 - 23"
  } else {
    return `${getShortDate(from)}&nbsp;&mdash;&nbsp;${getShortDate(to)}`; // если путешествие в разные месяцы - выводит в формате "MAY 18 - JUN 02"
  }
};

const createTripInfoTemplate = (events, sortedEvents) => {
  const destinationFrom = sortedEvents[0].events[0].destination.name; // берет город из первого события
  const destinationTo = sortedEvents[sortedEvents.length - 1].events[sortedEvents[sortedEvents.length - 1].events.length - 1].destination.name; // берет город из последнего события

  const date = events ? getTripDateRange(sortedEvents[0].date, sortedEvents[sortedEvents.length - 1].date) : ``;

  const intermediateDestinations = new Set();

  events.forEach((item) => { // вычисляет, есть ли в путешествии другие города, кроме начального и конечного. Сохраняет их в множество
    if ((item.destination.name !== destinationFrom) && (item.destination.name !== destinationTo)) {
      intermediateDestinations.add(item.destination.name);
    }
  });

  let middleDestination = ``;

  if (intermediateDestinations.size === 1) { // добавит промежуточный город в заголов, если он один
    middleDestination = Array.from(intermediateDestinations)[0];
  } else if (intermediateDestinations.size > 1) { // добавит три точки, если промежуточных городов несколько
    middleDestination = `...`;
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinationFrom} &mdash; ${middleDestination ? middleDestination + ` &mdash; ` : ``}${destinationTo}</h1>

        <p class="trip-info__dates">${date}</p>
      </div>
    </section>`
  );
};

export {createTripInfoTemplate};
