import {
  Component,
  input,
  output,
  effect,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  DestroyRef
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { IAnnotation, IAnnotationChanges } from './model';
import { PAGE_ELEMENT } from './document-page.component';

@Component({
  selector: 'app-document-annotation',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'absolute cursor-move p-1 bg-yellow-100/70 border border-yellow-400 rounded shadow-md min-w-[140px] transition-shadow hover:shadow-lg',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerUp($event)',
    '(click)': '$event.stopPropagation()',
  },
  template: `
    <div class="flex flex-row items-center gap-0.5">
      <div class="flex items-center justify-center h-4" aria-hidden="true">
        <svg class="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="7" cy="6" r="2" /> <circle cx="15" cy="6" r="1.5" />
          <circle cx="7" cy="12" r="2" /> <circle cx="15" cy="12" r="1.5" />
          <circle cx="7" cy="18" r="2" /> <circle cx="15" cy="18" r="1.5" />
        </svg>
      </div>
      <input
        type="text"
        [formControl]="textControl"
        class="w-full bg-transparent text-sm outline-none placeholder-gray-600 focus:ring-2 focus:ring-yellow-400 rounded px-1 py-0.5"
        placeholder="Add note..."
        aria-label="Annotation text input"
      />
      <button
        (click)="delete.emit(annotation().id)"
        class="text-xs cursor-pointer text-red-600 hover:text-red-800 rounded px-1"
        aria-label="Delete annotation"
      >
        ✕
      </button>
    </div>
  `
})
export class DocumentAnnotationComponent {
  readonly annotation = input.required<IAnnotation>();
  readonly update = output<IAnnotationChanges>();
  readonly delete = output<string>();

  readonly textControl = new FormControl('');
  private readonly pageElement = inject(PAGE_ELEMENT);
  private readonly hostEl = inject(ElementRef<HTMLElement>).nativeElement;
  private pageRect!: DOMRect;
  private dragging = false;
  private pointerId = -1;
  private lastX = 0;
  private lastY = 0;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private readonly destroyRef: DestroyRef) {
    this.textControl.valueChanges.subscribe(val => {
      console.log('annotation::textControl val =>', val);
      this.update.emit({ id: this.annotation().id, text: val ?? '' });
    });

    effect(() => {
      if (this.textControl.value !== this.annotation().text) {
        this.textControl.setValue(this.annotation().text, { emitEvent: false });
      }
    });

    this.destroyRef.onDestroy(() => {
      console.log('annotation::onDestroy =>');
      if (this.pointerId !== -1 && this.hostEl.hasPointerCapture(this.pointerId)) {
        this.hostEl.releasePointerCapture(this.pointerId);
      }
    })
  }

  private _normalizeValue(value: number) {
    return Math.max(0, Math.min(100, value));
  }

  onPointerDown(event: PointerEvent) {
    console.log('onPointerDown::event =>', event);

    event.stopPropagation();
    if ((event.target as HTMLElement).matches('input, button')) {
      return;
    }

    this.pageRect = this.pageElement.getBoundingClientRect();
    // -- save pointerId for release capture on abnormal destroy
    this.pointerId = event.pointerId;
    this.hostEl.setPointerCapture(event.pointerId);
    this.dragging = true;
    this.lastX = this._normalizeValue(((event.clientX - this.pageRect.left) / this.pageRect.width) * 100);
    this.lastY = this._normalizeValue(((event.clientY - this.pageRect.top) / this.pageRect.height) * 100);

    this.offsetX = this.lastX - this.annotation().x;
    this.offsetY = this.lastY - this.annotation().y;
  }

  onPointerMove(event: PointerEvent) {
    if (!this.dragging) {
      return;
    }

    event.stopPropagation();
    const x = this._normalizeValue(((event.clientX - this.pageRect.left) / this.pageRect.width) * 100 - this.offsetX);
    const y = this._normalizeValue(((event.clientY - this.pageRect.top) / this.pageRect.height) * 100 - this.offsetY);

    if (x === this.lastX && y === this.lastY) {
      return;
    }

    this.lastX = x;
    this.lastY = y;

    console.log('dragging===true onPointerMove::event =>', { event, x, y, pageRect: this.pageRect });
    this.update.emit({ id: this.annotation().id, x, y });
  }

  onPointerUp(event: PointerEvent) {
    if (!this.dragging) {
      return;
    }

    event.stopPropagation();
    console.log('dragging===true onPointerUp::event =>', event);

    this.dragging = false;

    if (this.hostEl.hasPointerCapture(event.pointerId)) {
      this.hostEl.releasePointerCapture(event.pointerId);
    }
  }
}
