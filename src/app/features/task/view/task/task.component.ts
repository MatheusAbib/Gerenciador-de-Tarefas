import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InclusionFormComponent } from '../../components/inclusion-form/inclusion-form.component';
import { TaskListComponent } from "../../components/task-list/task-list.component";

const COMPONENTS = [InclusionFormComponent];

@Component({
    selector: 'app-task',
    imports: [...COMPONENTS, TaskListComponent],
    template: `
  <div class="flex flex-col mx-10 mt-8">
  <!--Titulo-->
  <span class="font-bold text-4xl">Meu quadro de tarefas</span>

  <!--Formulario-->
  <app-inclusion-form />

  <!--Lista de tarefas-->
    <app-task-list />
  </div>
`,
    styles: [''],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {}
