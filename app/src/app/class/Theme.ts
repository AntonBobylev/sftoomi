import { inject, WritableSignal } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';

export default class Theme
 {
     protected readonly darkMode: WritableSignal<boolean> = inject(TUI_DARK_MODE);

     public isDarkMode(): WritableSignal<boolean>
     {
         return this.darkMode;
     }
 }
