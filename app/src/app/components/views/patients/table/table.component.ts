import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { TuiLoader } from '@taiga-ui/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTh, TuiTableThGroup, TuiTableTr } from '@taiga-ui/addon-table';

import Sftoomi from '../../../../class/Sftoomi';

import AppTableComponent from '../../../core/app-table/app-table.component';

import AppTableColumn from '../../../../type/AppTableColumn';

@Component({
    selector: 'patients-table',
    templateUrl: '../../../core/app-table/app-table.component.html',
    styleUrl: '../../../core/app-table/app-table.component.scss',
    imports: [
        TuiLoader, NgForOf, TuiTableDirective,
        TuiTableTbody, TuiTableTh, TuiTableThGroup,
        TuiTableTr
    ]
})

export default class PatientsTableComponent extends AppTableComponent
{
    protected override readonly url: string = 'http://localhost:8080/getPatients';

    protected override readonly columns: AppTableColumn[] = [{
        name: 'id',
        caption: 'ID'
    }, {
        name: 'last_name',
        caption: 'Last name'
    }, {
        name: 'first_name',
        caption: 'First name'
    }, {
        name: 'middle_name',
        caption: 'Middle name'
    }, {
        name: 'dob',
        caption: 'Date of birth',
        valueRenderer: function (value: any): string
        {
            return Sftoomi.dateShort(value.date) ?? 'undefined';
        }
    }];
}
