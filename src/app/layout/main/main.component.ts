import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CategoryComponent } from '../../features/category/view/category/category.component';
import { TaskComponent } from '../../features/task/view/task/task.component';
import { MatDividerModule } from '@angular/material/divider';

const COMPONENTS = [CategoryComponent, TaskComponent];
const MODULES = [MatDividerModule];

@Component({
    selector: 'app-main',
    imports: [...COMPONENTS, ...MODULES],
    template: `
    <div class="h-screen flex w-full">
      <!-- Categorias -->
      <app-category class="w-1/4 "></app-category>

      <!-- Divisor -->
      <mat-divider class="h-full opacity-50" vertical></mat-divider>

      <!-- Tarefas -->
      <app-task class="w-3/4"></app-task>
    </div>
  `,
    styles: [''],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {}
