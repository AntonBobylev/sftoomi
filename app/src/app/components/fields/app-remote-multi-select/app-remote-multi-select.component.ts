import { Component } from '@angular/core';

import AppRemoteSelectImports from '../app-remote-select/app-remote-select-imports';

import Sftoomi from '../../../class/Sftoomi';

import AppRemoteSelectComponent, { AppRemoteSelectRecord } from '../app-remote-select/app-remote-select.component';

export type AppRemoteMultiSelectRecord = AppRemoteSelectRecord;

@Component({
    selector: 'app-remote-multi-select',
    templateUrl: 'app-remote-multi-select.component.html',
    imports: AppRemoteSelectImports,
    styleUrls: [
        'app-remote-multi-select.component.scss',
        '../app-remote-select/app-remote-select.component.scss'
    ]
})

export default class AppRemoteMultiSelectComponent extends AppRemoteSelectComponent
{
    protected override readonly stringify = ({name}: AppRemoteMultiSelectRecord): string => name;

    protected override valueChanged(selectedRecords: any): void
    {
        if (Sftoomi.isEmpty(selectedRecords)) {
            this.store.set([]);
        }

        this.excludeItemsIds = selectedRecords.map((row: AppRemoteMultiSelectRecord): number => row.id);
    };
}
