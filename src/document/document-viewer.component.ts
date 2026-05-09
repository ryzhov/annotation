import { Component, effect, input } from '@angular/core';
import { IPage } from './model';

@Component({
  selector: 'app-document-viewer',
  template: `
    <section
      class="overflow-y-auto flex flex-col items-center py-4"
      [style.transform]="'scale(' + scale()/100 + ')'"
      [style.transformOrigin]="'top center'"
    >
      @for (page of pages(); track page.number) {
        <div
          class="relative mb-4 border border-gray-300 cursor-crosshair"
          (click)="onPageClick(page.number, $event)"
          [attr.aria-label]="'Add annotation to page ' + page.number"
        >
          <img
            [src]="page.imageUrl"
            class="block w-200 h-auto pointer-events-none select-none"
            loading="lazy"
          />
        </div>
      }
    </section>
  `
})
export class DocumentViewerComponent {
  readonly pages = input.required<IPage[]>();
  readonly scale = input.required<number>();

  constructor() {
    effect(() => {
      console.log('[DEBUG] pages =>', this.pages());
    });
  }

  onPageClick(pageNum: number, event: MouseEvent) {
    const pageEl = event.currentTarget as HTMLElement;
    const rect = pageEl.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    console.log({ x, y, pageNum });
  }
}
