import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import Sftoomi from './class/Sftoomi';

import { RoutesPaths } from './app.routes';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NzLayoutModule, NzMenuModule, RouterLink, RouterLinkActive],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})

export class App
{
    protected readonly Sftoomi = Sftoomi;
    protected readonly RoutesPaths = RoutesPaths;
}
