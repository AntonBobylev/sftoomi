import { Component, EventEmitter, Input, OnInit, Output, signal, ViewChild, WritableSignal } from '@angular/core';

import AppRemoteSelectImports from './app-remote-select-imports';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';

export type AppRemoteSelectRecord = {
    id: number,
    name: string,
    tooltip?: string
};

export type AppRemoteSelectLookupApiResult = {
    data: AppRemoteSelectRecord[]
};

@Component({
    selector: 'app-remote-select',
    templateUrl: 'app-remote-select.component.html',
    imports: AppRemoteSelectImports,
    styleUrl: './app-remote-select.component.scss'
})

export default class AppRemoteSelectComponent implements OnInit
{
    @Input({required: true}) public label!: string;
    @Input({required: true}) public lookupUrl!: string;

    @Input() public showExpandedNameInOptionsList: boolean = false;

    @Input({alias: 'minimalQueryLength'}) public minSearchLength: number = 3;
    @Input() public emptyContent: string = '';

    @ViewChild('inputFieldCtrl') protected inputFieldCtrl!: any;

    @Output() public onOptionSelected: EventEmitter<AppRemoteSelectRecord | null> = new EventEmitter<AppRemoteSelectRecord | null>;

    protected readonly store: WritableSignal<AppRemoteSelectRecord[]> = signal([]);
    protected readonly isLoading: WritableSignal<boolean> = signal(false);

    protected readonly stringify = function (record: number | AppRemoteSelectRecord | undefined): string {
        if (!record) {
            return '';
        }

        if (typeof record === 'number') {
            return record.toString();
        }

        return record.id.toString();
    };

    protected excludeItemsIds: number[] = [];

    private queryController: AbortController = new AbortController();

    public ngOnInit(): void
    {
        this.emptyContent = Sftoomi.format(Sftoomi.Translator.translate('fields.remote_select.tip'), [this.minSearchLength]);
    }

    protected valueChanged(selectedRecord: AppRemoteSelectRecord): void
    {
        if (Sftoomi.isEmpty(selectedRecord)) {
            this.store.set([]);
        }

        this.excludeItemsIds = Sftoomi.isEmpty(selectedRecord) ? [] : [selectedRecord.id];
        this.onOptionSelected.emit(selectedRecord);
    };

    protected onSearch(query: string | null): void
    {
        this.queryController.abort();

        if (!query || query.length < this.minSearchLength) {
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
            success: function (_response: any, _request: XMLHttpRequest, data: AppRemoteSelectLookupApiResult): void {
                me.isLoading.set(false);

                me.store.set(data.data);
            },
            failure: function (): void {
                me.isLoading.set(false);
            }
        });
    }

    protected onFocusChange(): void
    {
        this.store.set([]);
        this.inputFieldCtrl.el.value = null;
    }
}
