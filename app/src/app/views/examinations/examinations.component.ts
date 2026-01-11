import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout'
import { Params } from '@angular/router'
import { DateTime } from 'luxon';

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

        let dos: DateTime | null = this.getCurrentDos();

        this.fixExaminationInUrl(
            dos
                ? dos.toFormat(this.Sftoomi.Constants.dateIsoFormat)
                : DateTime.now().toFormat(this.Sftoomi.Constants.dateIsoFormat)
        );
    }

    ngAfterViewInit(): void
    {
        let dos: DateTime | null = this.getCurrentDos();
        if (dos) {
            this.filtersCtrl.setValues({
                ...this.filtersCtrl.getValues(),
                examination_date: dos.toJSDate()
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
        this.fixExaminationInUrl(DateTime.fromJSDate(values.examination_date).toFormat(this.Sftoomi.Constants.dateIsoFormat));
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

    private getCurrentDos(): DateTime | null
    {
        let params: Params = this.activatedRoute.snapshot.queryParams;
        if (this.Sftoomi.isEmpty(params['dos'])) {
            return null;
        }

        let dos: DateTime = DateTime.fromISO(params['dos']);

        return dos.isValid
            ? dos
            : null;
    }
}
