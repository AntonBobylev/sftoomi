import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout'
import { ActivatedRoute, Params, Router } from '@angular/router'
import moment from 'moment'

import Sftoomi from '../../class/Sftoomi'

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

export default class ExaminationsComponent implements AfterViewInit
{
    @ViewChild('filtersCtrl')
    protected readonly filtersCtrl!: ExaminationsFiltersComponent;

    @ViewChild('tableCtrl')
    protected readonly tableCtrl!: ExaminationsTableComponent;

    protected isFiltersCollapsed: boolean = false;

    protected readonly Sftoomi = Sftoomi

    private router: Router = inject(Router);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    constructor()
    {
        let dos: moment.Moment | null = this.getCurrentDos();

        this.fixExaminationInUrl(
            dos
                ? dos.format(Sftoomi.Constants.dateIsoFormat)
                : moment().format(Sftoomi.Constants.dateIsoFormat)
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

    private search(values: ExaminationsFiltersPanelOut): void
    {
        this.fixExaminationInUrl(moment(values.examination_date).format(Sftoomi.Constants.dateIsoFormat));

        this.tableCtrl.setIsLoading(true);
        this.tableCtrl.refresh(Sftoomi.formValuesToFormData(values));
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
        if (Sftoomi.isEmpty(params['dos'])) {
            return null;
        }

        let momentDos: moment.Moment = moment(params['dos']);

        return momentDos.isValid()
            ? momentDos
            : null;
    }
}
