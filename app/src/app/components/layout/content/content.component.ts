import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'app-content',
    imports: [
        RouterOutlet
    ],
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss'
})

export class ContentComponent
{
    protected readonly Sftoomi = Sftoomi;
}
