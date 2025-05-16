import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { TaskService } from '../../service/task.service';
import { NoTasksComponent } from '../no-tasks/no-tasks.component';
import { CategoryService } from '../../../category/service/category.service';
import { Category } from '../../../category/model/category.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [AsyncPipe, NoTasksComponent, NgStyle],
  template: `
    <div class="mt-8">
      @if(tasks$ | async){
        @if(numberOfTasks() > 0){
          @for(task of tasks(); track task.id){
            <div
              class="flex flex-row justify-start mb-4 items-center gap-3 cursor-pointer"

              [ngStyle]="{ 'borderLeft': '3px solid ' + getCategoryColor(task.categoryId) }">

            <input
              type="checkbox"
              class="form-checkbox h-6 w-7 rounded transition"
              [checked]="isCompleted(task.id)"
              (change)="onCheckboxChange($event, task.id)"
              [ngStyle]="{ 'accent-color': getCategoryColor(task.categoryId) }"
            />

              <span
                [class.line-through]="isCompleted(task.id)"
                class="transition-all text-[20px]"
              >
                {{ task.title }}
              </span>

              <button
                (click)="deleteTask(task.id)"
                class="text-[15px] text-red-500 border border-red-500 px-2 py-1 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                Excluir
              </button>
            </div>
          }
        } @else {
          <app-no-tasks
            alt="Nenhuma tarefa adicionada"
            imageUrl="no_data.svg"
            message="Nenhuma tarefa adicionada"
          />
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);

  public tasks$ = this.taskService.getTasks();
  public tasks = this.taskService.tasks;
  public numberOfTasks = this.taskService.numberOfTasks;

  public categoryColors: Record<string, string> = {};

  private completedTaskIds = new Set<string>();

  constructor() {
    // Recupera tarefas completadas do localStorage
    const saved = localStorage.getItem('completedTasks');
    if (saved) {
      this.completedTaskIds = new Set(JSON.parse(saved));
    }

    // Carrega categorias e associa cores
    this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categoryColors = categories.reduce<Record<string, string>>((map, category: Category) => {
        map[category.id] = category.color;
        return map;
      }, {});
    });
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryColors[categoryId] || 'gray';
  }

  onCheckboxChange(event: Event, id: string): void {
    const input = event.target as HTMLInputElement;
    this.toggleComplete(id, input.checked);
  }

  toggleComplete(id: string, checked: boolean): void { //Recebe o id da tarefa e se ela foi marcada ou desmarcada (checked).Se marcada, adiciona o id no Set.Se desmarcada, remove do Set
    if (checked) {
      this.completedTaskIds.add(id);
    } else {
      this.completedTaskIds.delete(id);
    }
    this.saveCompletedTasks(); //E sempre salva o novo estado no localStorage.
  }

  isCompleted(id: string): boolean { //Verifica se o id está dentro do Set.Retorna true ou false — e isso é usado pra marcar o checkbox e riscar a tarefa.
    return this.completedTaskIds.has(id);
  }

  private saveCompletedTasks(): void { //Converte o Set de IDs pra um array (Array.from(...)), transforma em JSON e salva no localStorage.
    localStorage.setItem('completedTasks', JSON.stringify(Array.from(this.completedTaskIds)));
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id.toString()).subscribe(() => {
      this.tasks$ = this.taskService.getTasks();
      this.completedTaskIds.delete(id);
      this.saveCompletedTasks();
    });
  }
}
