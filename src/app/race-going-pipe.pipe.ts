import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'raceGoingPipe'
})
export class RaceGoingPipePipe implements PipeTransform {

  transform(value: number): string {

    switch (value) {
      case 0:
        return 'firm';
      case 1:
        return 'good';
      case 2:
        return 'soft';
      default:
        return 'unknown going type ' + this.raceData.GOING;
    }
  }

}
