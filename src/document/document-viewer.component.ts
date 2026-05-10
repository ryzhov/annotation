import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { IAnnotation, IAnnotationChanges, IPage } from './model';
import { DocumentPageComponent } from './document-page.component';

@Component({
  selector: 'app-document-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <app-document-page
          [number]="page.number"
          [url]="page.imageUrl"
          [annotations]="annotations()"
          (addAnnotation)="onAddAnnotation($event)"
          (updateAnnotation)="onUpdateAnnotation($event)"
          (deleteAnnotation)="onDeleteAnnotation($event)"
        />
      }
    </section>
  `
})
export class DocumentViewerComponent {
  readonly pages = input.required<IPage[]>();
  readonly scale = input.required<number>();
  readonly annotations = signal<IAnnotation[]>([]);

  constructor() {
    effect(() => {
      console.log('[DEBUG] pages =>', this.pages());
    });
  }

  onAddAnnotation(event: IAnnotation) {
    console.log('DocumentViewer::addAnnotation =>', event);
    this.annotations.update(annotations => [...annotations, event]);
  }

  onUpdateAnnotation(event: IAnnotationChanges) {
    console.log('DocumentViewer::updateAnnotation =>', event);
    this.annotations.update(annotations => annotations.map(item =>
      item.id === event.id ? { ...item, ...event } : item
    ));
  }

  onDeleteAnnotation(event: string) {
    console.log('DocumentViewer::deleteAnnotation =>', event);
    this.annotations.update(annotations => annotations.filter(({ id }) => id !== event));
  }
}
