import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MainListComponent } from '../../components/main-list/main-list.component';
import { ColorsListComponent } from '../../components/colors-list/colors-list.component';
import { CategoryService } from '../../service/category.service';
import { AsyncPipe } from '@angular/common';

const COMPONENTS = [MainListComponent, ColorsListComponent];

const PIPES = [AsyncPipe];

@Component({
    selector: 'app-category',
    imports: [...COMPONENTS, ...PIPES],
    template: `
  <div class="flex flex-col justify-between h-full w-full">

  @if (categories$ | async){
      <!--main list-->
      <app-main-list />

      <!--colors list-->
      <app-colors-list />

    }
  </div>
  `,
    styles: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);

  public categories$ = this.categoryService.getCategories();
}
