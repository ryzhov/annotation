import { Component, input } from '@angular/core';

@Component({
  selector: 'app-document-page',
  template: `
    <div
      class="relative mb-4 border border-gray-300 cursor-crosshair"
      (click)="onPageClick(number(), $event)"
      [attr.aria-label]="'Add annotation to page ' + number()"
    >
      <img
        [src]="url()"
        class="block w-200 h-auto pointer-events-none select-none"
        loading="lazy"
      />
    </div>
  `
})
export class DocumentPageComponent {
  readonly number = input.required<number>();
  readonly url = input.required<string>();

  onPageClick(pageNum: number, event: MouseEvent) {
    const pageEl = event.currentTarget as HTMLElement;
    const rect = pageEl.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    console.log({ x, y, pageNum });
  }
}
