import { Component, Injector } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';

import ServiceLocator from './services/locator.service';

import Sftoomi from './class/Sftoomi';
import Theme from './class/Theme';

import { HeaderComponent } from './components/layout/header/header.component';
import { ContentComponent } from './components/layout/content/content.component';
import { FooterComponent } from './components/layout/footer/footer.component';

@Component({
    selector: 'app-root',
    imports: [
        TuiRoot,
        HeaderComponent,
        ContentComponent,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent
{
    protected readonly Sftoomi = Sftoomi;

    constructor(private injector: Injector)
    {
        ServiceLocator.injector = this.injector;

        Sftoomi.Theme = new Theme();
    }
}
