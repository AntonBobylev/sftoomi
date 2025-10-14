import { AfterViewInit, computed, Directive, inject, OnDestroy, Signal, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import Sftoomi from '../../../class/Sftoomi';
import Fetcher from '../../../class/Fetcher';

import { DialogType } from '../../../class/Dialog';

import ResponsiveLayoutService from '../../../services/responsive-layout.service';

@Directive()
export default abstract class AppBaseEditDialog implements AfterViewInit, OnDestroy
{
    protected abstract readonly form: FormGroup;

    protected readonly idField: string = 'id';

    protected readonly width: number | string | undefined;

    protected isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly Sftoomi = Sftoomi;

    protected readonly fetchExtraRequestOnLoad: boolean = false;

    protected readonly loadUrl: string | undefined;
    protected readonly saveUrl: string | undefined;

    protected abstract afterLoad(data: any): void;

    protected readonly data: any = inject(NZ_MODAL_DATA);

    protected readonly queryController: AbortController = new AbortController();

    protected readonly responsiveLayoutService: ResponsiveLayoutService = inject(ResponsiveLayoutService);

    protected readonly dialogResizer: Signal<any> = computed((): void => {
        let width = this.width;
        if (this.responsiveLayoutService.isSmallWidth()) {
            width = '100%';
        }

        setTimeout((): void => {
            this.getDialogInstance().updateConfig({
                nzWidth: width
            });
        });
    });

    constructor(private readonly dialog: NzModalRef)
    {
    }

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }

    ngAfterViewInit(): void
    {
        this.load();
    }

    protected getDialogInstance(): NzModalRef
    {
        return this.dialog;
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

    protected save(): void
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

                this.dialog.close(true);
            },
            failure: (_code: any, message: any, _request: any): void => {
                this.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                Sftoomi.Dialog.show(message, DialogType.ERROR, (): void => this.dialog.close(false))
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

    protected validate(): void
    {
        for (const [_key, control] of Object.entries(this.form.controls)) {
            control.markAsDirty();
            control.markAsTouched();
        }
    }

    protected isPreValid(): boolean
    {
        // implement in child
        return true;
    }
}
