import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

import Sftoomi from '../../../class/Sftoomi';

import I18nSwitcherComponent from '../../core/app-language-switcher/app-language-switcher.component';
import AppThemeSwitcher from '../../core/app-theme-switcher/app-theme-switcher';
import { RoutesPaths } from '../../../app.routes';

@Component({
    selector: 'app-header',
    imports: [
        TuiButton, RouterLink,
        I18nSwitcherComponent, AppThemeSwitcher
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})

export class HeaderComponent
{
    protected readonly Sftoomi = Sftoomi;
    protected readonly RoutesPaths = RoutesPaths;
}
