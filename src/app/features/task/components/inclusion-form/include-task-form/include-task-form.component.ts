import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../../category/services/category.service';
import { createTaskForm } from '../../../constants/create-task-form';
import { Task } from '../../../model/task.model';
import { TaskService } from '../../../services/task.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { NgClass } from '@angular/common';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';

const MODULES = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
];

const COMMONS = [NgClass];

@Component({
  selector: 'app-include-task-form',
  imports: [...MODULES, ...COMMONS],
  template: `
    <form
      [ngClass]="{
        'cursor-not-allowed animate-pulse': isIncludeTaskFormDisabled(),
        'cursor-pointer': !isIncludeTaskFormDisabled(),
      }"
      autocomplete="off"
      class="flex flex-col sm:flex-row gap-3 select-none w-full"
      [formGroup]="newTaskForm">
      <mat-form-field class="flex-1">
        <mat-label for="title">Tarefa</mat-label>
        <input
          formControlName="title"
          matInput
          placeholder="Digite uma nova tarefa..."
          (keyup.enter)="onEnterToAddATask()" />
        <mat-hint class="text-tertiary">Aperte Enter para adicionar</mat-hint>
      </mat-form-field>
      <mat-form-field class="w-full sm:w-48">
        <mat-label for="categoryId">Categoria</mat-label>
        <mat-select
          formControlName="categoryId"
          (selectionChange)="selectionChangeHandler($event)">
          @for (category of categories(); track category.id) {
            <mat-option value="{{ category.id }}">
              <div class="category-option">
                <div [ngClass]="getColorClass(category.id)" class="color-dot"></div>
                <span>{{ category.name }}</span>
              </div>
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
    </form>
  `,
  styles: [`
    .category-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    :host {
      display: block;
      width: 100%;
    }
    .text-tertiary{
      font-size: 15px;
    };
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncludeTaskFormComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);
  private readonly snackBarService = inject(SnackBarService);

  public readonly categories = this.categoryService.categories;
  public readonly newTaskForm = createTaskForm();
  private readonly destroy$ = inject(DestroyRef);

  public isIncludeTaskFormDisabled = computed(() => {
    if (this.taskService.isLoadingTask()) {
      this.newTaskForm.disable();
      return this.taskService.isLoadingTask();
    }
    this.newTaskForm.enable();
    return this.taskService.isLoadingTask();
  });

  public getColorClass(categoryId: string): string {
    const colorMap: Record<string, string> = {
      '1': 'bg-green-600',
      '2': 'bg-orange-600',
      '3': 'bg-blue-600',
      '4': 'bg-red-600',
      '5': 'bg-purple-600',
    };
    return colorMap[categoryId] || 'bg-gray-600';
  }

  public selectionChangeHandler(event: MatSelectChange): void {
    const categoryId = event.value;
    this.categoryService.selectedCategoryId.set(categoryId);
  }

  public onEnterToAddATask(): void {
    if (this.newTaskForm.invalid) return;

    this.taskService.isLoadingTask.set(true);

    const { title, categoryId } = this.newTaskForm.value;

    const newTask: Partial<Task> = {
      title,
      categoryId,
      isCompleted: false,
    };

    this.taskService
      .createTask(newTask)
      .pipe(
        finalize(() => this.taskService.isLoadingTask.set(false)),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe({
        next: task => {
          this.taskService.insertATaskInTheTasksList(task);
          this.newTaskForm.reset({ categoryId: this.categoryService.selectedCategoryId() });
          this.snackBarConfigHandler('Tarefa adicionada com sucesso!');
        },
        error: error => {
          this.snackBarConfigHandler('Erro ao adicionar tarefa');
        },
      });
  }

  public snackBarConfigHandler(message: string): void {
    this.snackBarService.showSnackBar(message, 3000, 'end', 'top');
  }
}