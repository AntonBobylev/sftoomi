import { ChangeDetectionStrategy, Component, OnDestroy, signal, ViewChild, WritableSignal } from '@angular/core';
import { TuiAccordion } from '@taiga-ui/experimental';
import { TuiLoader } from '@taiga-ui/core';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';

import ProcessingFiltersPanelComponent, { ProcessingFiltersPanelOut } from './filters/filters.component';
import ProcessingModuleExaminationsPanelComponent from './examinations/panel.component';

import getExaminationsAPI from '../../../APIs/getExaminationsAPI';

@Component({
    selector: 'processing-module',
    imports: [
        TuiAccordion, ProcessingFiltersPanelComponent,
        ProcessingModuleExaminationsPanelComponent, TuiLoader
    ],
    templateUrl: './processing.component.html',
    styleUrl: './processing.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export default class ProcessingComponent implements OnDestroy
{
    @ViewChild('filtersCtrl')
    protected readonly filtersCtrl!: ProcessingFiltersPanelComponent;

    protected readonly Sftoomi = Sftoomi;

    protected readonly loadUrl: string = '/getExaminations';

    protected queryController: AbortController = new AbortController();

    protected isLoading: WritableSignal<boolean> = signal<boolean>(true);
    protected examinations: WritableSignal<any[]> = signal<any[]>([]);

    public getFiltersControl(): ProcessingFiltersPanelComponent
    {
        return this.filtersCtrl;
    }

    public setIsLoading(isLoading: boolean): void
    {
        this.isLoading.set(isLoading);
    }

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }

    protected search(values: ProcessingFiltersPanelOut): void
    {
        let me: this = this,
            data: FormData = Sftoomi.formValuesToFormData(values);

        this.queryController.abort();
        this.queryController = new AbortController();

        me.isLoading.set(true);
        (new Fetcher).request({
            url: this.loadUrl,
            data: data,
            signal: this.queryController.signal,
            success: function (_response: any, _request: any, data: getExaminationsAPI): void {
                me.isLoading.set(false);
                me.examinations.set(data.data);
            },
            failure: function (): void {
                me.isLoading.set(false);
            }
        });
    }
}
