import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { CategoryService } from '../../service/category.service';

@Component({
    selector: 'app-main-list',
    imports: [],
    template: `
  <section class=" mt-16 mx-12 pl-8 ">
    <span class="text-3xl font-bold">Categorias</span>

    <ul class="mt-4 space-y-9">
      @for(category of categories(); track category.id){
        <li class="text-2xl font-medium">{{category.name}}</li>
      }
    </ul>
  </section>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainListComponent {
  private readonly categoryService = inject(CategoryService);

  public categories = this.categoryService.categories;

}
