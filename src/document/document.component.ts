import { ChangeDetectionStrategy, Component, effect, inject, InjectionToken, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DocumentHeaderComponent } from './document-header.component';
import { IDocument } from './model';
import { DocumentViewerComponent } from './document-viewer.component';

export const DOCUMENT = new InjectionToken<Signal<IDocument>>('DOCUMENT');

@Component({
  selector: 'app-document',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocumentHeaderComponent,
    DocumentViewerComponent,
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
    <app-document-viewer
      [pages]="document().pages"
      [scale]="scale()"
    />
  `
})
export class DocumentComponent {
  readonly document = inject(DOCUMENT);
  readonly scale = signal(100);
  readonly name = signal('test doc');

  constructor() {
    effect(() => {
      console.log('[DEBUG] document =>', this.document());
    });
  }

  save() {
    console.log('on save event =>');
  }
}
