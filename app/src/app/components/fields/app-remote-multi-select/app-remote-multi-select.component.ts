import { Component, Input, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiHintDirective, TuiLoader, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { TuiCell } from '@taiga-ui/layout';
import { TuiValueChanges } from '@taiga-ui/cdk';
import { TuiMultiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

import Fetcher from '../../../class/Fetcher';
import Sftoomi from '../../../class/Sftoomi';

export type AppRemoteMultiSelectRecord = {
    id: number,
    name: string,
    tooltip?: string
};

export type AppRemoteMultiSelectLookupApiResult = {
    data: AppRemoteMultiSelectRecord[]
};

@Component({
    selector: 'app-remote-multi-select',
    templateUrl: 'app-remote-multi-select.component.html',
    imports: [
        TuiMultiSelectModule, TuiTextfieldOptionsDirective,
        TuiTextfieldControllerModule, ReactiveFormsModule,
        TuiCell, TuiLoader, TuiHintDirective, TuiValueChanges
    ],
    styleUrl: 'app-remote-multi-select.component.scss'
})

export default class AppRemoteMultiSelectComponent
{
    @Input({required: true}) public label!: string;
    @Input() public showExpandedNameInOptionsList: boolean = false;

    @Input({required: true}) public lookupUrl!: string;

    @Input() public emptyContent: string = Sftoomi.Translator.translate('fields.remote_multi_select.tip');

    protected readonly store: WritableSignal<AppRemoteMultiSelectRecord[]> = signal([]);
    protected readonly isLoading: WritableSignal<boolean> = signal(false);

    protected readonly stringify = ({name}: AppRemoteMultiSelectRecord): string => name;

    private queryController: AbortController = new AbortController();

    private excludeItemsIds: number[] = [];

    protected valueChanged(selectedRecords: AppRemoteMultiSelectRecord[]): void
    {
        if (Sftoomi.isEmpty(selectedRecords)) {
            this.store.set([]);
        }

        this.excludeItemsIds = selectedRecords.map((row: AppRemoteMultiSelectRecord): number => row.id);
    };

    protected onSearch(query: string | null): void
    {
        this.queryController.abort();

        if (!query || query.length < 3) {
            return;
        }

        this.queryController = new AbortController();

        this.store.set([]);

        let me: this = this,
            data: FormData = new FormData();

        data.append('query', query);
        data.append('exclude_ids', me.excludeItemsIds.join(','));

        me.isLoading.set(true);
        new Fetcher().request({
            url: this.lookupUrl,
            signal: this.queryController.signal,
            data: data,
            success: function (_response: any, _request: XMLHttpRequest, data: AppRemoteMultiSelectLookupApiResult): void {
                me.isLoading.set(false);

                me.store.set(data.data);
            },
            failure: function (): void {
                me.isLoading.set(false);
            }
        });
    }
}
