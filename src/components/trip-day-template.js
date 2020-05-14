import {SHORT_MONTH_NAMES} from "../const.js";
import {createEventItemTemplate} from './event-item-template.js';


const createTripDayTemplate = (day, index) => {
  const shortDate = SHORT_MONTH_NAMES[day.date.getMonth()].toUpperCase() + ` ` + day.date.getDate();

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

export {createTripDayTemplate};
