import { Component } from '@angular/core';

import Sftoomi from '../../class/Sftoomi';

@Component({
    selector: 'app-patients',
    imports: [],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.scss'
})

export default class PatientsComponent
{
    protected readonly Sftoomi = Sftoomi;
}
