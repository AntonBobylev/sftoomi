import { Component } from '@angular/core';
import Sftoomi from '../../../class/Sftoomi';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})

export class HomeComponent
{

    protected readonly Sftoomi = Sftoomi;
}
