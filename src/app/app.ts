import { Component, DestroyRef, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationError,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterOutlet
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoaderComponent } from '../ui/loader.component';

@Component({
  selector: 'app-root',
  host: {
    class: 'block mx-auto px-4 max-w-sm md:max-w-4xl',
  },
  imports: [RouterOutlet, LoaderComponent],
  template: `
    <main class="flex flex-col">
      @if(resolving()) {
        <app-loader />
      } @else {
        <router-outlet></router-outlet>
      }
    </main>

    <footer class="p-4 text-center text-sm text-gray-600 border-t border-gray-300">
      Annotation test application designed by <a href="mailto:anryzhov@gmail.com">anryzhov</a>
    </footer>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('annotation');
  protected readonly resolving = signal(false);

  constructor(
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
  ) {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof ResolveStart) {
          this.resolving.set(true);
        } else if (event instanceof ResolveEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.resolving.set(false);
        }
      });
  }
}
