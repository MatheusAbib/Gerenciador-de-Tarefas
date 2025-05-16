import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../services/theme.service';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

const COMMONS = [NgClass];

@Component({
    selector: 'app-theme-toggle',
    imports: [
        COMMONS,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    template: `
    <div class="fixed top-0 right-0">
      <button
        type="button"
        mat-icon-button
        class="m-1 p-0"
        (click)="themeService.toggleColorTheme()"
        [matTooltip]="isCurrentThemeDark ? 'Modo Claro' : 'Modo Escuro'">

        <mat-icon class="font-icon" [ngClass]="isCurrentThemeDark ? 'text-amber-500' : 'text-sky-500'">
          {{ isCurrentThemeDark ? 'light_mode' : 'dark_mode' }}
        </mat-icon>
      </button>
    </div>
  `,
    styles: []
})
export class ThemeToggleComponent implements OnInit {
  public themeService = inject(ThemeService);
  public isCurrentThemeDark: boolean = false;
  private subscription: Subscription = Subscription.EMPTY;

  ngOnInit(): void {
    // Inscreve-se no Observable para obter o valor de isCurrentThemeDark
    this.subscription = this.themeService.isCurrentThemeDark$.subscribe((isDark) => {
      this.isCurrentThemeDark = isDark;
    });
  }

  ngOnDestroy(): void {
    // Cancela a inscrição quando o componente for destruído
    this.subscription.unsubscribe();
  }
}
