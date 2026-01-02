import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

import AppBaseModule from '../../components/core/app-base-module'

@Component({
    selector: 'app-home',
    imports: [NgClass],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})

export default class HomeComponent extends AppBaseModule
{
}
