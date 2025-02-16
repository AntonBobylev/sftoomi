import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

import Sftoomi from '../../../class/Sftoomi';

import I18nSwitcherComponent from '../../core/app-language-switcher/app-language-switcher.component';

@Component({
    selector: 'app-header',
    imports: [
        TuiButton,
        RouterLink,
        I18nSwitcherComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})

export class HeaderComponent
{

    protected readonly Sftoomi = Sftoomi;
}
