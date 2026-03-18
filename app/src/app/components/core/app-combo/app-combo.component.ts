import { Component, Input, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip'

import { DialogType } from '../../../class/Dialog';
import Fetcher from '../../../class/Fetcher';

import AppBaseField from '../app-base-field';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

export type AppComboRecord<T = string | number> = {
    caption: string,
    value:   T
};

@Component({
    selector: 'app-combo',
    templateUrl: './app-combo.component.html',
    imports: [
        ReactiveFormsModule, NzSelectComponent, NzOptionComponent,
        NzColDirective, NzFormLabelComponent, FormErrorTemplateComponent,
        NzFormControlComponent, NzFormItemComponent, NzTooltipDirective
    ],
    styleUrl: './app-combo.component.scss'
})

export default class AppComboComponent<T = AppComboRecord['value']> extends AppBaseField
{
    @Input() public useSearch: boolean = false;
    @Input() public useClear: boolean = false;
    @Input() public multiple: boolean = false;
    @Input() public placeholder: string = '';

    @Input() public remoteUrl: string | undefined;
    @Input({alias: 'minimalQueryLength'}) public minSearchLength: number = 3;

    public readonly selectionChange: OutputEmitterRef<T> = output();

    protected data:          WritableSignal<AppComboRecord<T>[]> = signal<AppComboRecord<T>[]>([]);
    protected listOfOptions: WritableSignal<AppComboRecord<T>[]> = signal<AppComboRecord<T>[]>([]);
    protected isLoading:     WritableSignal<boolean>             = signal<boolean>(false);

    private queryController: AbortController = new AbortController();

    public setData(records: AppComboRecord<T>[]): void
    {
        this.data.set(records);
        this.listOfOptions.set(this.data());
    }

    protected search(query: string): void
    {
        if (this.Sftoomi.isEmpty(this.remoteUrl)) {
            this.filterOptions(query);

            return;
        }

        this.queryController.abort();

        if (this.Sftoomi.isEmpty(query) || query.length < this.minSearchLength) {
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
                this.Sftoomi.Dialog.show(message, DialogType.ERROR);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        });
    }

    protected onSelectionChange(): void
    {
        this.selectionChange.emit(this.form.get(this.name)?.value);

        if (this.Sftoomi.isEmpty(this.remoteUrl)) {
            return;
        }

        this.data.set([]);
    }

    private filterOptions(query: string): void
    {
        this.listOfOptions.set([]);

        const lowerQuery: string = query.toLowerCase(),
              newListOfOptions: AppComboRecord<T>[] = this.data().filter((record: AppComboRecord<T>): boolean =>
                  record.caption.toString().toLowerCase().startsWith(lowerQuery)
              );

        this.listOfOptions.set(newListOfOptions);
    }
}
