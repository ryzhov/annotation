import { Injectable } from '@angular/core';

export type EventPoint = [x: number, y: number];


@Injectable()
export class EventPointService {

  private _normalizeValue(value: number) {
    return Math.max(0, Math.min(100, value));
  }

  calc(event: MouseEvent, rect: DOMRect, [offsetX, offsetY]: EventPoint = [0,0]): EventPoint {
    const x = this._normalizeValue(((event.clientX - rect.left) / rect.width) * 100 - offsetX);
    const y = this._normalizeValue(((event.clientY - rect.top) / rect.height) * 100 - offsetY);
    return [x,y];
  }
}
