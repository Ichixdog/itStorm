import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(date: string): unknown {
    const newDate = new Date(date);


const months = [
  "января", "февраля", "марта", "апреля", "мая", "июня", 
  "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const year = newDate.getFullYear();
const day = newDate.getDate();
const month = months[newDate.getMonth()];
const hours = String(newDate.getHours()).padStart(2, '0');
const minutes = String(newDate.getMinutes()).padStart(2, '0');


    return ` ${day} ${month} ${year} ${hours}:${minutes}`;
  }

}
