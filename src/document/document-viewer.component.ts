import { Component, effect, input } from '@angular/core';
import { IPage } from './model';
import { DocumentPageComponent } from './document-page.component';

@Component({
  selector: 'app-document-viewer',
  imports: [
    DocumentPageComponent
  ],
  template: `
    <section
      class="overflow-y-auto flex flex-col items-center py-4"
      [style.transform]="'scale(' + scale()/100 + ')'"
      [style.transformOrigin]="'top center'"
    >
      @for (page of pages(); track page.number) {
        <app-document-page [number]="page.number" [url]="page.imageUrl" />
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


}
