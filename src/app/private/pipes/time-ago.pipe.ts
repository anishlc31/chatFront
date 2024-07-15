import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(value).getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    if(diffMinutes <= 0 ){
       return null;
    }else if (diffMinutes < 60) {
      return `${diffMinutes} min `;
    } else if (diffHours < 24) {
      return `${diffHours} hours `;
    } else {
      return new Date(value).toLocaleDateString();
    }
  }
}
