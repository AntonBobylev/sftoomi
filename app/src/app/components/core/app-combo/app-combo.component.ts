import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';

import Sftoomi from '../../../class/Sftoomi';
import { DialogType } from '../../../class/Dialog';
import Fetcher from '../../../class/Fetcher';

import AppBaseField from '../app-base-field';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

export type AppComboRecord = {
    caption: string,
    value: string | number
};

@Component({
    selector: 'app-combo',
    templateUrl: './app-combo.component.html',
    imports: [
        ReactiveFormsModule, NzSelectComponent, NzOptionComponent,
        NzColDirective, NzFormLabelComponent, FormErrorTemplateComponent,
        NzFormControlComponent, NzFormItemComponent
    ],
    styleUrl: './app-combo.component.scss'
})

export default class AppComboComponent extends AppBaseField
{
    @Input() public useSearch: boolean = false;
    @Input() public useClear: boolean = false;
    @Input() public multiple: boolean = false;
    @Input() public placeholder: string = '';

    @Input() public remoteUrl: string | undefined;
    @Input({alias: 'minimalQueryLength'}) public minSearchLength: number = 3;

    @Output() public selectionChange: EventEmitter<AppComboRecord['value']> = new EventEmitter<AppComboRecord['value']>();

    protected data: WritableSignal<AppComboRecord[]> = signal<AppComboRecord[]>([]);
    protected listOfOptions: WritableSignal<AppComboRecord[]> = signal<AppComboRecord[]>([]);
    protected isLoading: WritableSignal<boolean> = signal<boolean>(false);

    private queryController: AbortController = new AbortController();

    public setData(records: AppComboRecord[]): void
    {
        this.data.set(records);
        this.listOfOptions.set(this.data());
    }

    protected search(query: string): void
    {
        if (Sftoomi.isEmpty(this.remoteUrl)) {
            this.filterOptions(query);

            return;
        }

        this.queryController.abort();

        if (Sftoomi.isEmpty(query) || query.length < this.minSearchLength) {
            return;
        }

        this.queryController = new AbortController();

        this.setData([]);

        let data: FormData = new FormData();

        data.append('query', query);
        data.append('exclude_ids', this.form.get(this.name)?.value ?? '');

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.remoteUrl!,
            signal: this.queryController.signal,
            data: data,
            success: (_response: any, _request: any, result: any): void => {
                this.setData(result.data);
            },
            failure: (_code: any, message: any, _request: any): void => {
                Sftoomi.Dialog.show(message, DialogType.ERROR);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        });
    }

    protected onSelectionChange(): void
    {
        this.selectionChange.emit(this.form.get(this.name)?.value);

        if (Sftoomi.isEmpty(this.remoteUrl)) {
            return;
        }

        this.data.set([]);
    }

    private filterOptions(query: string): void
    {
        this.listOfOptions.set([]);

        let newListOfOptions: AppComboRecord[] = [];
        this.data().forEach((record: AppComboRecord): void => {
            if (record.caption.toString().toLowerCase().startsWith(query.toLowerCase())) {
                newListOfOptions.push(record);
            }
        });

        this.listOfOptions.set(newListOfOptions);
    }
}
