import { Component } from '@angular/core';

import { HeaderComponent } from './components/layout/header/header.component';
import { ContentComponent } from './components/layout/content/content.component';
import { FooterComponent } from './components/layout/footer/footer.component';

@Component({
    selector: 'app-root',
    imports: [
        HeaderComponent,
        ContentComponent,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent
{
}
