import { ChangeDetectionStrategy, Component, inject, InjectionToken, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DocumentHeaderComponent } from './document-header.component';
import { IDocument } from './model';

export const DOCUMENT = new InjectionToken<Signal<IDocument>>('DOCUMENT');

@Component({
  selector: 'app-document',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocumentHeaderComponent,
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
  `
})
export class DocumentComponent {
  protected readonly document = inject(DOCUMENT);
  protected readonly scale = signal(100);
  protected readonly name = signal('test doc');

  save() {
    console.log('on save event =>');
  }
}
