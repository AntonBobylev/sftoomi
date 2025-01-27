import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [
        TuiButton,
        RouterLink
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})

export class HeaderComponent
{

}
