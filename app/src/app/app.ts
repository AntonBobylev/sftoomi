import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

import Sftoomi from './class/Sftoomi';

import { RoutesPaths } from './app.routes';

import LanguageSwitcherComponent from './components/misc/language-switcher/language-switcher.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet, NzLayoutModule, NzMenuModule,
        RouterLink, NzModalModule, LanguageSwitcherComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.less'
})

export class App
{
    protected readonly Sftoomi = Sftoomi;
    protected readonly RoutesPaths = RoutesPaths;

    constructor(private readonly nzDialog: NzModalService, private router: Router)
    {
        Sftoomi.init(nzDialog);
    }

    protected isRouteSelected(route: RoutesPaths): boolean
    {
        let currentRoute: string = this.router.url;
        if (currentRoute === '/') {
            currentRoute = '';
        }

        return route === currentRoute;
    }
}
