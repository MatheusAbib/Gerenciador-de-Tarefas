import { Component } from '@angular/core';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { MainComponent } from './layout/main/main.component';

const COMMONS = [MainComponent, ThemeToggleComponent];
@Component({
    selector: 'app-root',
    imports: [...COMMONS],
    template: `
    <div class="relative min-h-screen w-full">
      <app-theme-toggle></app-theme-toggle>
      <app-main></app-main>
    </div>
  `,
    styles: []
})
export class AppComponent {}
