import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http'
import { Category } from '../model/category.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable,tap  } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl;

  private readonly httpCliente = inject(HttpClient);

  public categories = signal<Category[]>([]);

  public selectedCategoryId = signal('1');

  public getCategories(): Observable<Category[]>{
    return this.httpCliente
    .get<Category[]>(`${this.apiUrl}/categories`)
    .pipe(tap(categories => this.categories.set(categories)));
  }
}
