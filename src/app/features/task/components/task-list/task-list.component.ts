import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { NoTasksComponent } from '../no-tasks/no-tasks.component';
import { CategoryService } from '../../../category/services/category.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-task-list',
  imports: [
    AsyncPipe,
    NgClass,
    NoTasksComponent,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="task-list-container">
      @if (tasks$ | async) {
        @if (numberOfTasks() > 0) {
          <div class="tasks-grid">
            @for (task of tasks(); track task.id) {
              <div class="task-card" [class.completed]="task.isCompleted">
                @if (editingTaskId() === task.id) {
                  <div class="edit-mode">
                    <input
                      [(ngModel)]="editTitle"
                      placeholder="Título da tarefa"
                      class="edit-input dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    <select 
                      [(ngModel)]="editCategoryId" 
                      class="edit-select dark:bg-gray-700 dark:text-white dark:border-gray-600">
                      @for (category of categories(); track category.id) {
                        <option [value]="category.id" class="dark:bg-gray-700 dark:text-white">
                          {{ category.name }}
                        </option>
                      }
                    </select>
                    <div class="edit-actions">
                      <button (click)="saveEdit(task.id)" class="save-btn">Salvar</button>
                      <button (click)="cancelEdit()" class="cancel-btn">Cancelar</button>
                    </div>
                  </div>
                } @else {
                  <div class="task-card-header">
                    <mat-checkbox
                      [checked]="task.isCompleted"
                      (change)="toggleComplete(task.id, $event.checked)"
                      class="task-checkbox">
                    </mat-checkbox>
                    <span class="task-title">{{ task.title }}</span>
                    <div class="task-actions">
                      <button mat-icon-button (click)="startEdit(task)" class="edit-btn">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button (click)="deleteTask(task.id)" class="delete-btn">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>
                  <div class="task-card-footer">
                    <div [ngClass]="getCategoryColorClass(task.categoryId)" class="category-badge">
                      <span>{{ getCategoryName(task.categoryId) }}</span>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        } @else {
          <app-no-tasks
            alt="Nenhuma tarefa adicionada"
            imageUrl="no_data.svg"
            message="Nenhuma tarefa adicionada 😔" />
        }
      }
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1rem;
    }

    .task-card {
      background: var(--card-bg, white);
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid var(--border-color, #e2e8f0);
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .task-card.completed {
      opacity: 0.7;
      background: var(--completed-bg, #f8fafc);
    }

    .task-card.completed .task-title {
      text-decoration: line-through;
      color: #94a3b8;
    }

    .task-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .task-checkbox {
      flex-shrink: 0;
    }

    .task-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary, #1e293b);
      word-break: break-word;
    }

    .task-actions {
      display: flex;
      gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .task-card:hover .task-actions {
      opacity: 1;
    }

    .edit-btn, .delete-btn {
      width: 32px;
      height: 32px;
      line-height: 32px;
    }

    .edit-btn mat-icon, .delete-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .task-card-footer {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color, #e2e8f0);
    }

    .category-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      color: white;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }

    .edit-mode {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .edit-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 6px;
      font-size: 0.9rem;
      background: var(--bg-primary, white);
      color: var(--text-primary, #1e293b);
    }

    .edit-select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 6px;
      font-size: 0.9rem;
      background: var(--bg-primary, white);
      color: var(--text-primary, #1e293b);
    }

    .edit-select option {
      background: var(--bg-primary, white);
      color: var(--text-primary, #1e293b);
    }

    .edit-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .save-btn, .cancel-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .save-btn {
      background: #10b981;
      color: white;
    }

    .save-btn:hover {
      background: #059669;
    }

    .cancel-btn {
      background: #ef4444;
      color: white;
    }

    .cancel-btn:hover {
      background: #dc2626;
    }

    @media (max-width: 640px) {
      .tasks-grid {
        grid-template-columns: 1fr;
      }
      
      .task-actions {
        opacity: 1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  private tasksService = inject(TaskService);
  private categoryService = inject(CategoryService);
  private snackBarService = inject(SnackBarService);

  public tasks$ = this.tasksService.getTasks();
  public tasks = this.tasksService.tasks;
  public numberOfTasks = this.tasksService.numberOfTasks;
  public categories = this.categoryService.categories;

  public editingTaskId = signal<string | null>(null);
  public editTitle = '';
  public editCategoryId = '';

  public getCategoryName(categoryId: string): string {
    const categories = this.categories();
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Sem categoria';
  }

  public getCategoryColorClass(categoryId: string): string {
    const colorMap: Record<string, string> = {
      '1': 'bg-green-600',
      '2': 'bg-orange-600',
      '3': 'bg-blue-600',
      '4': 'bg-red-600',
      '5': 'bg-purple-600',
    };
    return colorMap[categoryId] || 'bg-gray-600';
  }

  public toggleComplete(taskId: string, isCompleted: boolean): void {
    this.tasksService.updateIsCompletedStatus(taskId, isCompleted).subscribe({
      next: () => {
        this.snackBarService.showSnackBar('Status atualizado!', 2000, 'end', 'top');
      },
      error: () => {
        this.snackBarService.showSnackBar('Erro ao atualizar', 3000, 'end', 'top');
      }
    });
  }

  public startEdit(task: any): void {
    this.editingTaskId.set(task.id);
    this.editTitle = task.title;
    this.editCategoryId = task.categoryId;
  }

  public cancelEdit(): void {
    this.editingTaskId.set(null);
    this.editTitle = '';
    this.editCategoryId = '';
  }

  public saveEdit(taskId: string): void {
    if (!this.editTitle.trim()) {
      this.snackBarService.showSnackBar('Título não pode estar vazio', 3000, 'end', 'top');
      return;
    }

    const updatedTask = {
      id: taskId,
      title: this.editTitle,
      categoryId: this.editCategoryId,
      isCompleted: this.tasks().find(t => t.id === taskId)?.isCompleted || false
    };

    this.tasksService.updateTask(updatedTask).subscribe({
      next: () => {
        this.snackBarService.showSnackBar('Tarefa atualizada!', 2000, 'end', 'top');
        this.cancelEdit();
      },
      error: () => {
        this.snackBarService.showSnackBar('Erro ao atualizar', 3000, 'end', 'top');
      }
    });
  }

  public deleteTask(taskId: string): void {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta tarefa?');
    if (confirmDelete) {
      this.tasksService.deleteTask(taskId).subscribe({
        next: () => {
          this.snackBarService.showSnackBar('Tarefa excluída!', 2000, 'end', 'top');
        },
        error: () => {
          this.snackBarService.showSnackBar('Erro ao excluir', 3000, 'end', 'top');
        }
      });
    }
  }
}