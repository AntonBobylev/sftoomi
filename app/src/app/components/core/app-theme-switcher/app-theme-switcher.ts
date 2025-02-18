import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'app-theme-switcher',
    templateUrl: './app-theme-switcher.html',
    styleUrl: './app-theme-switcher.html',
    imports: [
        TuiButton,
        TuiHintDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class AppThemeSwitcher
{
    protected readonly Sftoomi = Sftoomi;

    protected switchTheme(): void
    {
        let isDarkMode = Sftoomi.Theme.isDarkMode();
        Sftoomi.Theme.isDarkMode().set(!isDarkMode())
    }
}
