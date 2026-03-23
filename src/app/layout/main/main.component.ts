import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IncludeTaskFormComponent } from '../../features/task/components/inclusion-form/include-task-form/include-task-form.component';
import { TaskListComponent } from '../../features/task/components/task-list/task-list.component';
import { CategoryService } from '../../features/category/services/category.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { MatDividerModule } from '@angular/material/divider';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    IncludeTaskFormComponent, 
    TaskListComponent, 
    ThemeToggleComponent,
    MatDividerModule, 
    NgClass
  ],
  template: `
    <div class="min-h-screen" style="background-color: var(--bg-primary);">
      <app-theme-toggle />
      
      <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold" style="color: var(--text-primary);">
            My Task Board
          </h1>
        </div>
        
        <div class="flex gap-6">
          <!-- Sidebar com categorias -->
          <div class="w-64 flex-shrink-0">
            <div class="rounded-lg shadow p-4" style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
              <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">Categorias</h2>
              <div class="space-y-2">
                @for (category of categories(); track category.id) {
                  <div 
                    class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all"
                    [class.bg-blue-50]="selectedCategoryId() === category.id"
                    (click)="selectCategory(category.id)"
                    style="color: var(--text-secondary);">
                    <div class="w-3 h-3 rounded-full" [ngClass]="getColorClass(category.id)"></div>
                    <span>{{ category.name }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Conteúdo principal -->
          <div class="flex-1">
            <div class="rounded-lg shadow p-6" style="background-color: var(--card-bg); border: 1px solid var(--border-color);">
              <app-include-task-form />
              <mat-divider class="my-6" />
              <app-task-list />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private categoryService = inject(CategoryService);
  
  public categories = this.categoryService.categories;
  public selectedCategoryId = this.categoryService.selectedCategoryId;

  getColorClass(categoryId: string): string {
    const colors: Record<string, string> = {
      '1': 'bg-green-600',
      '2': 'bg-orange-600',
      '3': 'bg-blue-600',
      '4': 'bg-red-600',
      '5': 'bg-purple-600',
    };
    return colors[categoryId] || 'bg-gray-600';
  }

  selectCategory(categoryId: string): void {
    this.categoryService.selectedCategoryId.set(categoryId);
  }
}