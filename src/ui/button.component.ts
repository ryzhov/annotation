import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="classes()"
      [disabled]="disabled()"
      [attr.aria-disabled]="disabled()"
      [type]="type()"
    >
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
  size = input<'sm' | 'md'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');

  disabled = input<boolean, boolean | string>(false, {
    transform: (value: boolean | string) => value === true || value === 'true' || value === ''
  });

  classes = computed(() => {
    const base = 'inline-flex items-center justify-center cursor-pointer font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = this.size() === 'sm'
      ? 'px-3 py-1.5 text-sm'
      : 'px-4 py-2 text-base';

    const variantClasses = this.variant() === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-200 text-gray-700 hover:bg-white';

    return `${base} ${sizeClasses} ${variantClasses}`;
  });
}
