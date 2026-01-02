import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout'
import { Params } from '@angular/router'
import moment from 'moment'

import AppBaseModuleWithFilters from '../../components/core/app-base-module-with-filters'

import ExaminationsTableComponent from './table/table.component';
import ExaminationsFiltersComponent, { ExaminationsFiltersPanelClearEventData, ExaminationsFiltersPanelOut } from './filters/filters.component';

@Component({
    selector: 'app-examinations',
    templateUrl: './examinations.component.html',
    imports: [
        ExaminationsTableComponent, ExaminationsFiltersComponent,
        NzLayoutComponent, NzSiderComponent
    ],
    styleUrl: './examinations.component.less'
})

export default class ExaminationsComponent extends AppBaseModuleWithFilters implements AfterViewInit
{
    @ViewChild('filtersCtrl')
    protected readonly filtersCtrl!: ExaminationsFiltersComponent;

    @ViewChild('tableCtrl')
    protected readonly tableCtrl!: ExaminationsTableComponent;

    protected isFiltersCollapsed: boolean = false;

    constructor()
    {
        super();

        let dos: moment.Moment | null = this.getCurrentDos();

        this.fixExaminationInUrl(
            dos
                ? dos.format(this.Sftoomi.Constants.dateIsoFormat)
                : moment().format(this.Sftoomi.Constants.dateIsoFormat)
        );
    }

    ngAfterViewInit(): void
    {
        let dos: moment.Moment | null = this.getCurrentDos();
        if (dos) {
            this.filtersCtrl.setValues({
                ...this.filtersCtrl.getValues(),
                examination_date: dos.toDate()
            });
        }

        this.tableCtrl.setIsLoading(true);
    }

    protected filtersLoaded(values: ExaminationsFiltersPanelOut): void
    {
        this.search(values);
    }

    protected onSearch(values: ExaminationsFiltersPanelOut): void
    {
        this.search(values);
    }

    protected onClear(values: ExaminationsFiltersPanelClearEventData): void
    {
        if (values.doSearch) {
            this.search(values);
        }
    }

    protected override search(values: ExaminationsFiltersPanelOut): void
    {
        this.fixExaminationInUrl(moment(values.examination_date).format(this.Sftoomi.Constants.dateIsoFormat));
        super.search(values);
    }

    private fixExaminationInUrl(dos: string): void
    {
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
                dos: dos
            },
            queryParamsHandling: 'merge'
        });
    }

    private getCurrentDos(): moment.Moment | null
    {
        let params: Params = this.activatedRoute.snapshot.queryParams;
        if (this.Sftoomi.isEmpty(params['dos'])) {
            return null;
        }

        let momentDos: moment.Moment = moment(params['dos']);

        return momentDos.isValid()
            ? momentDos
            : null;
    }
}
