import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import {
    TuiTableCell,
    TuiTableDirective,
    TuiTableTbody, TuiTableTd,
    TuiTableTh,
    TuiTableThGroup,
    TuiTableTr
} from '@taiga-ui/addon-table';
import { NgForOf } from '@angular/common';
import { TuiLoader } from '@taiga-ui/core';

import Fetcher from '../../../class/Fetcher';
import Sftoomi from '../../../class/Sftoomi';

import getPatientsAPI from '../../../APIs/getPatientsAPI';

@Component({
    selector: 'app-patients',
    imports: [
        TuiTableDirective, TuiTableThGroup, TuiTableTh,
        TuiTableTbody, NgForOf, TuiTableTr, TuiTableCell,
        TuiTableTd, TuiLoader
    ],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.scss'
})

export class PatientsComponent implements OnInit
{
    protected readonly Sftoomi = Sftoomi;

    protected readonly data: WritableSignal<getPatientsAPI['data']> = signal<getPatientsAPI['data']>([]);
    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly columns: string[] = [
        'id',
        'last_name',
        'first_name',
        'middle_name',
        'dob'
    ];

    ngOnInit(): void
    {
        let me: this = this;
        me.isLoading.set(true);

        (new Fetcher).request({
            url: 'http://localhost:8080/getPatients',
            success: function (response: any, request: XMLHttpRequest, data: getPatientsAPI): void {
                me.isLoading.set(false);
                me.data.set(data.data);
            },
            failure: function (): void {
                me.isLoading.set(false);
            }
        })
    }
}
