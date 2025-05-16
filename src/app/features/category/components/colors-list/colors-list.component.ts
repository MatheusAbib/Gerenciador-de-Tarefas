import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

const MODULES = [MatDividerModule];

@Component({
    selector: 'app-colors-list',
    imports: [...MODULES],
    template: `
    <section classe="flex flex-col gap-4 w-full">

    <!--Divisor-->
    <mat-divider class="opacity-50" />

     <!--Lista de cores-->
     <div class="flex flex-wrap justify-center item-center gap-4 h-auto mb-20 text-2xl mt-20 text-center text-white font-semibold" >

      <button class="bg-green-500 rounded-xl w-40 hover:bg-green-600 h-10"> Casa </button>
      <button class="bg-orange-500 rounded-xl w-40 hover:bg-orange-600 h-10"> Estudo </button>
      <button class="bg-blue-500 rounded-xl w-40 hover:bg-blue-600 h-10"> Trabalho </button>
      <button class="bg-red-500 rounded-xl w-40 hover:bg-red-600 h-10"> Pessoal </button>
      <button class="bg-purple-500 rounded-xl w-40 hover:bg-purple-600 h-10"> Saúde </button>

</div>
</section>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorsListComponent {
category: any;
}
