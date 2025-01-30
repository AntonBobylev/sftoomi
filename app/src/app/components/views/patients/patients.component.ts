import { Component, OnInit } from '@angular/core';

import Fetcher from '../../../class/Fetcher';

@Component({
    selector: 'app-patients',
    imports: [],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.scss'
})

export class PatientsComponent implements OnInit
{
    ngOnInit(): void
    {
        (new Fetcher).request({
            url: 'http://localhost:8080/patients',
            success: function (response: any, request: any, data: any): void {
                console.log('API works!');
            }
        })
    }
}
