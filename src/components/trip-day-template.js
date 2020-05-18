import {getShortDate, createElement} from "../utils.js";
import {createEventItemTemplate} from './event-item-template.js';


const createTripDayTemplate = (day, index) => {
  const shortDate = getShortDate(day.date);

  const eventsList = day.events
    .map((event) => createEventItemTemplate(event))
    .join(`\n`);

  return (
    `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${index + 1}</span>
          <time class="day__date" datetime="${day.date.toISOString()}">${shortDate}</time>
        </div>

        <ul class="trip-events__list">
        ${eventsList}
        </ul>
      </li>
    </ul>`
  );
};

class TripDay {
  constructor(day, index) {
    this._day = day;
    this._index = index;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._day, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default TripDay;
