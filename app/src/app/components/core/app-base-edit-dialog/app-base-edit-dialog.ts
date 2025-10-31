import { AfterViewInit, Directive } from '@angular/core';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';

import { DialogType } from '../../../class/Dialog';

import AppBaseDialog from '../app-base-dialog'

@Directive()
export default abstract class AppBaseEditDialog extends AppBaseDialog implements AfterViewInit
{
    protected readonly idField: string = 'id';

    protected readonly fetchExtraRequestOnLoad: boolean = false;

    protected readonly loadUrl: string | undefined;
    protected readonly saveUrl: string | undefined;

    protected abstract afterLoad(data: any): void;

    ngAfterViewInit(): void
    {
        this.load();
    }

    protected load(): void
    {
        if (!this.fetchExtraRequestOnLoad || !this.loadUrl) {
            this.afterLoad(this.data);

            return;
        }

        let data: FormData = new FormData();
        if (this.data.id) {
            data.append(this.idField, this.data.id.toString());
        }

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.loadUrl,
            data: data,
            signal: this.queryController.signal,
            success: (_response: any, _request: any, data: any): void => {
                this.isLoading.set(false);

                this.afterLoad(data);
            },
            failure: (_code: any, message: any, _request: any): void => {
                this.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                Sftoomi.Dialog.show(message, DialogType.ERROR)
            }
        })
    }

    protected override save(): void
    {
        if (!this.isPreValid()) {
            return;
        }

        this.validate();
        if (this.form.invalid) {
            Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        let formValues: any = this.form.value,
            data: FormData = Sftoomi.formValuesToFormData(formValues);

        if (this.data?.id) {
            data.append(this.idField, this.data.id.toString());
            formValues[this.idField] = this.data.id;
        }

        data = this.getAdditionalDataOnSave(data);

        if (!this.saveUrl) {
            this.afterSave(data, formValues);

            return;
        }

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.saveUrl,
            data: data,
            signal: this.queryController.signal,
            success: (_response: any, _request: any, data: any): void => {
                this.isLoading.set(false);

                this.afterSave(data, formValues);

                this.close(true);
            },
            failure: (_code: any, message: any, _request: any): void => {
                this.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                Sftoomi.Dialog.show(message, DialogType.ERROR, (): void => this.getDialogInstance().close(false))
            }
        })
    }

    protected afterSave(_data: any, _rawData?: any): void
    {
    };

    protected getAdditionalDataOnSave(data: FormData): FormData
    {
        return data;
    }
}
