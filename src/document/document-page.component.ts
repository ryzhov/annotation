import { ChangeDetectionStrategy, Component, ElementRef, InjectionToken, input, output } from '@angular/core';
import { IAnnotation, IAnnotationChanges } from './model';
import { DocumentAnnotationComponent } from './document-annotation.component';

export const PAGE_ELEMENT = new InjectionToken<HTMLElement>('PAGE_ELEMENT');

@Component({
  selector: 'app-document-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocumentAnnotationComponent
  ],
  viewProviders: [
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

      @for (ann of annotations(); track ann.id) {
        @if (ann.page === number()) {
          <app-document-annotation
            [annotation]="ann"
            [style.left.%]="ann.x"
            [style.top.%]="ann.y"
            (update)="onAnnotationUpdate($event)"
            (delete)="onAnnotationDelete($event)"
          />
        }
      }
    </div>
  `
})
export class DocumentPageComponent {
  readonly number = input.required<number>();
  readonly url = input.required<string>();
  readonly annotations = input.required<IAnnotation[]>();
  readonly addAnnotation = output<IAnnotation>();
  readonly updateAnnotation = output<IAnnotationChanges>();
  readonly deleteAnnotation = output<string>();

  onPageClick(pageNum: number, event: MouseEvent) {
    const pageEl = event.currentTarget as HTMLElement;
    const rect = pageEl.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const annotation: IAnnotation = {
      id: crypto.randomUUID(),
      page: pageNum,
      x,
      y,
      text: ''
    };

    console.log('onPageClick::annotation =>', annotation);

    this.addAnnotation.emit(annotation);
  }

  onAnnotationDelete(event: string) {
    console.log('onAnnotationDelete =>', event);
    this.deleteAnnotation.emit(event);
  }

  onAnnotationUpdate(event: IAnnotationChanges) {
    console.log('onAnnotationUpdate =>', event);
    this.updateAnnotation.emit(event);
  }
}
