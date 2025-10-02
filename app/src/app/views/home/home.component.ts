import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import Sftoomi from '../../class/Sftoomi';

@Component({
    selector: 'app-home',
    imports: [NgClass],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})

export default class HomeComponent
{
    protected readonly Sftoomi = Sftoomi;
}
