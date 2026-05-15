import { ChangeDetectionStrategy, Component, ElementRef, inject, InjectionToken, input, output } from '@angular/core';
import { IAnnotation } from './model';
import { EventPointService } from './event-point.service';

export const PAGE_ELEMENT = new InjectionToken<HTMLElement>('PAGE_ELEMENT');

@Component({
  selector: 'app-document-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PAGE_ELEMENT,
      deps: [ElementRef],
      useFactory: (el: ElementRef<HTMLElement>): HTMLElement => el.nativeElement,
    }
  ],
  template: `
    <div
      data-page
      class="relative mb-4 border border-gray-300 cursor-crosshair"
      (click)="onPageClick(number(), $event)"
      [attr.aria-label]="'Add annotation to page ' + number()"
    >
      <img
        [src]="url()"
        [alt]="'Page number: ' + number()"
        class="block w-200 h-auto pointer-events-none select-none"
        loading="lazy"
      />
      <ng-content></ng-content>
    </div>
  `
})
export class DocumentPageComponent {
  readonly number = input.required<number>();
  readonly url = input.required<string>();
  readonly addAnnotation = output<IAnnotation>();
  private readonly eventPoint = inject(EventPointService);

  onPageClick(pageNum: number, event: MouseEvent) {
    const pageEl = event.currentTarget as HTMLElement;
    const rect = pageEl.getBoundingClientRect();

    const [x, y] = this.eventPoint.calc(event, rect);

    const annotation: IAnnotation = {
      id: crypto.randomUUID(),
      page: pageNum,
      x,
      y,
      text: ''
    };

    this.addAnnotation.emit(annotation);
  }
}
