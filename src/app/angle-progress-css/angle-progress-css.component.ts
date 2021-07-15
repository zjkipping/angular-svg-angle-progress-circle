import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-angle-progress-css',
  templateUrl: './angle-progress-css.component.html',
  styleUrls: ['./angle-progress-css.component.css']
})
export class AngleProgressCssComponent {
  @HostBinding('style.--start') private _start = 30;
  @HostBinding('style.--end') private _end = 250;
  
  startTextCoords = { x: 50, y: 50 };
  endTextCoords = { x: 50, y: 50 };

  @Input()
  set start(start: number) {
    this._start = start;
    this.current ??= 0;

    this.startTextCoords = this.getAngleTextPosition(start);
  }
  get start() {
    return this._start;
  }

  @Input()
  @HostBinding('style.--current')
  current: number = 0;

  @Input()
  set end(end: number) {
    this._end = end;

    this.endTextCoords = this.getAngleTextPosition(end);
  }
  get end() {
    return this._end;
  }

  private getAngleTextPosition(angle: number) {
    const r = 25;
    const radian = ((angle - 90) * Math.PI) / 180;
    const x = r * Math.cos(radian);
    const y = r * Math.sin(radian);

    return {
      x: x + 50 - 5,
      y: y + 50 + 2 
    };
  }
}