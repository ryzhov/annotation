import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-document-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="overflow-y-auto flex flex-col items-center py-4"
      [style.transform]="'scale(' + scale()/100 + ')'"
      [style.transformOrigin]="'top center'"
    >
      <ng-content></ng-content>
    </section>
  `
})
export class DocumentViewerComponent {
  readonly scale = input.required<number>();
}
