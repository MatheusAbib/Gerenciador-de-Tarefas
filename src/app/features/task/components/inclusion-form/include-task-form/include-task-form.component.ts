import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../../category/service/category.service';
import { createTaskForm } from '../../../constants/create-task-form';
import { Task } from '../../../model/task.model';
import { TaskService } from '../../../service/task.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../../../../shared/snack-bar.service';



const MODULES = [
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
];

@Component({
    selector: 'app-include-task-form',
    imports: [...MODULES],
    template: `
  <form

    [ngClass]="{
      'cursor-not-allowed animate-pulse': isIncludeTaskFormDisabled(),
      'cursor-pointer': !isIncludeTaskFormDisabled(),
    }"

    autocomplete="off" class="flex flex-row gap-2 select-none" [formGroup]="newTaskForm">
    <mat-form-field class="w-full">
        <mat-label>Tarefa</mat-label>
        <input formControlName="title" matInput placeholder="Adicionar tarefa" (keyup.enter)="onEnterToAddATask()" />
        <mat-hint class="text-tertiary">Enter para adicionar</mat-hint> <!-- mat-hint, por padrão, tem um pedding nele -->
    </mat-form-field>
     <mat-form-field>
        <mat-label>Categoria</mat-label>
        <mat-select formControlName="categoryId" (selectionChange)="selectionChangeHandler($event)" (keyup.enter)="onEnterToAddATask()">
          @for(category of categories(); track category.id){
            <mat-option value="{{ category.id}}">{{ category.name}}</mat-option>
          }

        </mat-select>
     </mat-form-field>
    </form>
  `,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncludeTaskFormComponent {

  private readonly categoryService = inject(CategoryService);

  private readonly taskService = inject(TaskService);

  public readonly categories = this.categoryService.categories;

  public readonly newTaskForm = createTaskForm();

  private readonly destroy$ = inject(DestroyRef);

  private readonly snackBarService = inject(SnackBarService);

  public isIncludeTaskFormDisabled = computed(() => { //cria o bloqueio e animação na barra de tarefas

    if(this.taskService.isLoadingTask()){
      this.newTaskForm.disable();

      return this.taskService.isLoadingTask();
    }

      this.newTaskForm.enable();

      return this.taskService.isLoadingTask();

  });

  public selectionChangeHandler(event: MatSelectChange): void{
      const categoryId = event.value;

      this.categoryService.selectedCategoryId.set(categoryId);
  }

  public onEnterToAddATask(): void{
    if(this.newTaskForm.invalid) return;

    this.taskService.isLoadingTask.set(true);

    const {title, categoryId} = this.newTaskForm.value;

    const newTask: Partial<Task> = {
      title,
      categoryId,
      isCompleted: false,
  };

    //mensagem de tarefas incluida no BD
  this.taskService.createTask(newTask)
    .pipe(delay(1400), finalize(() => this.taskService.isLoadingTask.set(false)), takeUntilDestroyed(this.destroy$)
  )
    .subscribe({
    next: task => this.taskService.insertATasksInTheTasksList(task),
    error: error => {
      this.snackBarService.showSnackBar(error.message, 4000, 'end', 'top')
    },

    complete: () => this.snackBarService.showSnackBar('Tarefa incluída', 4000, 'end', 'top'),
  });
  }
}
