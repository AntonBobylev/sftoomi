import { Component, ViewChild } from '@angular/core';
import { NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout'

import Sftoomi from '../../class/Sftoomi'

import ExaminationsTableComponent from './table/table.component';
import ExaminationsFiltersComponent, { ExaminationsFiltersPanelOut } from './filters/filters.component';

@Component({
    selector: 'app-examinations',
    templateUrl: './examinations.component.html',
    imports: [
        ExaminationsTableComponent,
        ExaminationsFiltersComponent,
        NzLayoutComponent,
        NzSiderComponent
    ],
    styleUrl: './examinations.component.less'
})

export default class ExaminationsComponent
{
    @ViewChild('filtersCtrl')
    protected readonly filtersCtrl!: ExaminationsFiltersComponent;

    @ViewChild('tableCtrl')
    protected readonly tableCtrl!: ExaminationsTableComponent;

    protected isFiltersCollapsed: boolean = false;

    protected readonly Sftoomi = Sftoomi

    protected filtersLoaded(values: ExaminationsFiltersPanelOut): void
    {
        this.search(values);
    }

    protected onSearch(values: ExaminationsFiltersPanelOut): void
    {
        this.search(values);
    }

    protected onClear(values: ExaminationsFiltersPanelOut): void
    {
        this.search(values);
    }

    private search(values: ExaminationsFiltersPanelOut): void
    {
        this.tableCtrl.refresh(Sftoomi.formValuesToFormData(values));
    }
}
