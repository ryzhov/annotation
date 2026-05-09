import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  host: {
    class: 'flex justify-center items-center h-48',
  },
  template: `
    <div class="animate-spin rounded-full h-15 w-15 border-t-2 border-b-2 border-primary-500"></div>
  `
})
export class LoaderComponent {
}
