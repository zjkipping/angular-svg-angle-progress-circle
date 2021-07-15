import { Component } from '@angular/core';
import { Observable, range, of } from 'rxjs';
import {
  map,
  debounceTime,
  concatMap,
  delay,
  shareReplay,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Try messing with these 3 properties
  start = 30;
  end = 250;
  animationDuration = 500;

  // used for mocking out the progress updates from an API
  angleTick = 10;
  progressTickAmount = (this.end - this.start) / this.angleTick;
  angleProgressStaggered: Observable<number>;
  angleProgressSmooth: Observable<number>;

  constructor() {
    this.angleProgressStaggered = range(1, this.progressTickAmount).pipe(
      // mocking out data from a socket API where request times are random
      concatMap(i => of(i).pipe(delay(300 + Math.random() * 500))),

      // The `debounceTime` here is important to keep the animations smooth
      // by only keeping the latest angle target from a series of fast API requests
      // otherwise the animation will seem to "jump" from one angle to another
      debounceTime(this.animationDuration),
      map((index: number) => index * this.angleTick),
      map((addedAngle: number) => addedAngle + this.start),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.angleProgressSmooth = range(1, this.progressTickAmount).pipe(
      concatMap(i => of(i).pipe(delay(500))),
      map((index: number) => index * this.angleTick),
      map((addedAngle: number) => addedAngle + this.start),
      tap(angle => console.log(angle)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
