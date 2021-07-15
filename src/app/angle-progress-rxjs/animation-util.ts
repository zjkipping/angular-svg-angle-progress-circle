import { animationFrameScheduler, timer, of, defer } from 'rxjs';
import { takeUntil, map, repeat, endWith } from 'rxjs/operators';

export function linearEaseTween(start: number, end: number, duration: number) {
  return defer(() =>
    of(animationFrameScheduler.now(), animationFrameScheduler).pipe(
      repeat(),
      map((start: number) => animationFrameScheduler.now() - start),
      map((time: number) => ((end - start) * time) / duration + start),
      takeUntil(timer(duration)),
      endWith(end)
    )
  );
}
