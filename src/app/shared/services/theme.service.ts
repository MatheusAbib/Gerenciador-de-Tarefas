import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const LOCAL_STORAGE_KEY = 'DPA:THEME';

type ColorThemeT = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _document = inject(DOCUMENT);

  // Usando BehaviorSubject em vez de signal
  private _isCurrentThemeDark = new BehaviorSubject<boolean>(false);

  public get isCurrentThemeDark$() {
    return this._isCurrentThemeDark.asObservable();
  }

  constructor() {
    // Inicializa o tema com o valor armazenado, se houver
    const storedTheme = this.getPreferredColorTheme();
    this.setColorTheme(storedTheme);
  }

  public getPreferredColorTheme(): ColorThemeT {
    const storedTheme = this._getStoredTheme();
    return storedTheme ? storedTheme : 'light';
  }

  private _getStoredTheme(): ColorThemeT | null {
    if (typeof localStorage === 'undefined') return null;

    const storedThemeObject = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedThemeObject) return null;

    const parsedStoredThemeObject = JSON.parse(storedThemeObject);
    return parsedStoredThemeObject?.colorTheme ?? null;
  }

  private _setStoredColorTheme(colorTheme: ColorThemeT): void {
    if (typeof localStorage === 'undefined') return;

    const storedThemeObject: { colorTheme: ColorThemeT } = { colorTheme };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedThemeObject));
  }

  public setColorTheme(colorTheme: ColorThemeT): void {
    const isCurrentThemeDark = colorTheme === 'dark';
    this._isCurrentThemeDark.next(isCurrentThemeDark);

    // Aplica o tema no documento
    if (isCurrentThemeDark) {
      this._document.documentElement.classList.add('dark');
    } else {
      this._document.documentElement.classList.remove('dark');
    }
  }

  public toggleColorTheme(): void {
    const currentColorTheme = this._isCurrentThemeDark.value ? 'light' : 'dark';
    this.setColorTheme(currentColorTheme);
    this._setStoredColorTheme(currentColorTheme);
  }
}
