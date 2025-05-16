import { EnvironmentInjector, inject, Provider, APP_INITIALIZER } from "@angular/core";
import { ThemeService } from "../shared/services/theme.service";

function initializeTheme(): () => void {
  const themeService = inject(ThemeService);
  return () => {
    const currentColorTheme = themeService.getPreferredColorTheme();
    themeService.setColorTheme(currentColorTheme);
  };
}

export const configThemeInitializerProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeTheme,
  multi: true,
  deps: []
};
