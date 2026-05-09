import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ButtonComponent } from '../ui/button.component';
import { SCALE_LIMITS } from '../app.routes';

@Component({
  selector: 'app-document-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent
  ],
  template: `
    <div class="bg-primary-400 text-white flex flex-row items-center justify-between py-2">
      <div class="text-xl font-bold px-4">{{ name() }}</div>

      <div class="flex flex-row items-center gap-1 mx-1">
        <span class="inline-block text-l px-4">{{ scale() }}</span>

        <app-button
          variant="secondary"
          size="sm"
          [disabled]="scale() <= limits.min" (click)="decrease.emit()"
        >
          -
        </app-button>

        <app-button
          variant="secondary"
          size="sm"
          [disabled]="scale() >= limits.max" (click)="increase.emit()"
        >
          +
        </app-button>

        <app-button
          variant="secondary"
          size="sm"
          (click)="save.emit()"
        >
          Save
        </app-button>
      </div>
    </div>
  `
})
export class DocumentHeaderComponent {
  readonly name = input.required<string>();
  readonly scale = input.required<number>();
  readonly increase = output<void>();
  readonly decrease = output<void>();
  readonly save = output<void>();

  readonly limits = inject(SCALE_LIMITS);
}
