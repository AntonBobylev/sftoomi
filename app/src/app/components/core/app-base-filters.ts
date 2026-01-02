import { AfterViewInit, Directive, EventEmitter, Output, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

import Sftoomi from '../../class/Sftoomi';
import Fetcher from '../../class/Fetcher';
import { DialogType } from '../../class/Dialog';

@Directive()
export default abstract class AppBaseFilters implements AfterViewInit
{
    @Output() public abstract onSearch: EventEmitter<any>;
    @Output() public abstract onClear : EventEmitter<any>;
    @Output() public abstract onLoaded: EventEmitter<any>;

    protected abstract readonly form: FormGroup;

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly Sftoomi = Sftoomi;

    protected abstract readonly loadUrl: string;

    public abstract getValues(): any;

    protected abstract clearFields(): void;

    ngAfterViewInit(): void
    {
        this.clearForm(false);

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.loadUrl,
            success: (_response: any, _request: any, data: any): void => {
                if (Sftoomi.isEmpty(data)) {
                    return;
                }

                this.afterLoad(data);

                this.onLoaded.emit(this.getValues());
            },
            failure: (_code: any, message: any, _request: any): void => {
                if (message === 'canceled') {
                    return;
                }

                Sftoomi.Dialog.show(message, DialogType.ERROR);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        })
    }

    public setValues(values: object): void
    {
        this.form.setValue(values);
    }

    public clearForm(doSearch: boolean = true): void
    {
        this.clearFields();

        this.onClear.emit(Sftoomi.mergeObjects(
            this.getValues(),
            { doSearch: doSearch || false }
        ));
    }

    protected onSearchClick(): void
    {
        if (this.form.invalid) {
            Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        this.onSearch.emit(this.getValues());
    }

    protected afterLoad(_data: any): void
    {
    }
}
