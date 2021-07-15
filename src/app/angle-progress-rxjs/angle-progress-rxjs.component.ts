import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { pairwise, startWith, map, concatMap } from 'rxjs/operators';

import { linearEaseTween } from './animation-util';
import { ArcPoint, createSvgArc, SvgArc } from './svg-util';

@Component({
  selector: 'app-angle-progress-rxjs',
  templateUrl: './angle-progress-rxjs.component.html',
  styleUrls: ['./angle-progress-rxjs.component.css']
})
export class AngleProgressRxjsComponent implements OnDestroy {
  @Input('startAngle') set _startAngle(angle: number) {
    this.startAngle = angle;
    this.startAngleTextPosition = this.getAngleTextPosition(angle);
    this.createBackgroundArcs();
  }
  startAngle?: number;

  @Input('endAngle') set _endAngle(angle: number) {
    this.endAngle = angle;
    this.endAngleTextPosition = this.getAngleTextPosition(angle);
    this.createBackgroundArcs();
  }
  endAngle?: number;

  @Input('currentAngle') set _currentAngle(angle: number) {
    this.currentAngle.next(angle);
  }
  currentAngle = new Subject<number>();

  @Input() animationDuration = 500;

  renderArcs = false;

  innerSpread = 40;
  position = 100;
  radius = this.position / 2;

  backgroundArc?: SvgArc;
  voidArc?: SvgArc;
  progressArc?: SvgArc;
  startAngleTextPosition?: ArcPoint;
  endAngleTextPosition?: ArcPoint;

  destroy = new Subject<void>();

  constructor() {
    this.currentAngle
      .pipe(
        startWith(undefined),
        pairwise(),
        concatMap(([start, end]) =>
          linearEaseTween(
            start ? start : end,
            end,
            start ? this.animationDuration : 1
          )
        ),
        map((endAngle: number) =>
          createSvgArc(
            this.position,
            this.position,
            this.radius,
            this.innerSpread,
            this.startAngle,
            endAngle
          )
        )
      )
      // Doing a manual subscribe here since the animation needs to kick off before the the template starts rendering, otherwise the animation starts up part way through
      .subscribe((arc: SvgArc) => (this.progressArc = arc));
  }

  // if start & end angles are expected to change across the lifetime of the component
  // This chunk of arc creation will need to become an rxjs pipeline.
  // And also be combined with the pipeline above.
  private createBackgroundArcs() {
    if ((this.startAngle, this.endAngle)) {
      this.backgroundArc = createSvgArc(
        this.position,
        this.position,
        this.radius,
        this.innerSpread,
        this.startAngle,
        this.endAngle
      );
      this.voidArc = createSvgArc(
        this.position,
        this.position,
        this.radius,
        this.innerSpread,
        this.endAngle,
        360 + this.startAngle
      );

      this.renderArcs = true;

      this.currentAngle;
    }
  }

  private getAngleTextPosition(angle: number) {
    const radian = ((angle - 90) * Math.PI) / 180;
    const x = this.innerSpread * Math.cos(radian);
    const y = this.innerSpread * Math.sin(radian);

    // 12 is the font size, so adjusting the y by the font size
    // Adjusting the x on a large part of the left side of the circle due to placement of text
    const textPosition = {
      x: x + (200 <= angle && angle <= 340 ? 6 : 0) + this.position,
      y: y + 12 / 3 + this.position
    };

    return textPosition;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
