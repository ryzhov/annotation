import { ChangeDetectionStrategy, Component, effect, inject, InjectionToken, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DocumentHeaderComponent } from './document-header.component';
import { IAnnotation, IAnnotationChanges, IDocument } from './model';
import { DocumentViewerComponent } from './document-viewer.component';
import { DocumentPageComponent } from './document-page.component';

export const DOCUMENT = new InjectionToken<Signal<IDocument>>('DOCUMENT');

@Component({
  selector: 'app-document',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocumentHeaderComponent,
    DocumentViewerComponent,
    DocumentPageComponent,
  ],
  providers: [
    {
      provide: DOCUMENT,
      deps: [ActivatedRoute],
      useFactory: (route: ActivatedRoute) => toSignal(route.data.pipe(
        map(({ document }) => document as IDocument)
      ))
    }
  ],
  template: `
    <app-document-header
      [name]="document().name"
      [scale]="scale()"
      (increase)="scale.update(it => it + 10)"
      (decrease)="scale.update(it => it - 10)"
      (save)="save()"
    />

    <app-document-viewer [scale]="scale()">
      @for (page of document().pages; track page.number) {
        <app-document-page
          [number]="page.number"
          [url]="page.imageUrl"
          [annotations]="annotations()"
          (addAnnotation)="onAddAnnotation($event)"
          (updateAnnotation)="onUpdateAnnotation($event)"
          (deleteAnnotation)="onDeleteAnnotation($event)"
        />
      }
    </app-document-viewer>
  `
})
export class DocumentComponent {
  readonly document = inject(DOCUMENT);
  readonly scale = signal(100);
  readonly annotations = signal<IAnnotation[]>([]);

  constructor() {
    effect(() => {
      console.log('[DEBUG] document =>', this.document());
    });
  }

  save() {
    console.log('save document =>', { ...this.document(), annotations: this.annotations() });
  }

  onAddAnnotation(event: IAnnotation) {
    console.log('Document::addAnnotation =>', event);
    this.annotations.update(annotations => [...annotations, event]);
  }

  onUpdateAnnotation(event: IAnnotationChanges) {
    console.log('Document::updateAnnotation =>', event);
    this.annotations.update(annotations => annotations.map(item =>
      item.id === event.id ? { ...item, ...event } : item
    ));
  }

  onDeleteAnnotation(event: string) {
    console.log('Document::deleteAnnotation =>', event);
    this.annotations.update(annotations => annotations.filter(({ id }) => id !== event));
  }
}
