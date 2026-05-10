import { Component, input, output, effect, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { IAnnotation, IAnnotationChanges } from './model';

@Component({
  selector: 'app-document-annotation',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'absolute cursor-move p-1 bg-yellow-100/70 border border-yellow-400 rounded shadow-md min-w-[140px] transition-shadow hover:shadow-lg',
    '(pointerdown)': 'onPointerDown($event)',
    '(click)': '$event.stopPropagation()'
  },
  template: `
    <div class="flex flex-row items-center gap-1">
      <input
        type="text"
        [formControl]="textControl"
        class="w-full bg-transparent text-sm outline-none placeholder-gray-600 focus:ring-2 focus:ring-yellow-400 rounded px-1 py-0.5"
        placeholder="Add note..."
        aria-label="Annotation text input"
      />
      <button
        (click)="onDeleteClick(annotation().id, $event)"
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

  constructor() {
    this.textControl.valueChanges.subscribe(val => {
      console.log('annotation::textControl val =>', val);
      this.update.emit({ id: this.annotation().id, text: val ?? '' });
    });

    effect(() => {
      console.log('annotation::effect =>', this.annotation());
      if (this.textControl.value !== this.annotation().text) {
        this.textControl.setValue(this.annotation().text, { emitEvent: false });
      }
    });
  }

  onPointerDown(event: PointerEvent) {
    console.log('onPointerDown::event =>', event);

    if ((event.target as HTMLElement).matches('input, button')) {
      event.stopPropagation();
      return;
    }
    event.preventDefault();


    const pageEl = (event.target as HTMLElement)?.closest('[data-page]');
    console.log('onPointerDown::pageEl =>', pageEl);

    if (!pageEl) return;

    const rect = pageEl.getBoundingClientRect();
    const initialX = ((event.clientX - rect.left) / rect.width) * 100;
    const initialY = ((event.clientY - rect.top) / rect.height) * 100;

    const onMove = (e: PointerEvent) => {
      console.log('onPointerDown::onMove event =>', e);

      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

      // Only emit if position actually changed to avoid excessive change detection
      if (x !== initialX || y !== initialY) {
        const update: IAnnotationChanges = { id: this.annotation().id, x, y }
        console.log('onPointerDown::onMove update =>', update);
        this.update.emit(update);
      }
    };

    const onUp = () => {
      console.log('onPointerDown::onUp =>');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  onDeleteClick(id: string, event: MouseEvent) {
    console.log('onDeleteClick::event =>', event);
    this.delete.emit(id);
  }
}
