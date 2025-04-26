import { AfterViewInit, Directive, inject, OnDestroy, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';

import Sftoomi from '../../class/Sftoomi';
import Fetcher from '../../class/Fetcher';

import PopupMsgService from '../../services/popup-msg.service';

@Directive()
export default abstract class AppBaseEditDialog implements AfterViewInit, OnDestroy
{
    protected abstract readonly context: TuiDialogContext<any, any>;
    protected abstract readonly form: FormGroup;

    protected isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly Sftoomi = Sftoomi;

    protected readonly fetchExtraRequestOnLoad: boolean = false;

    protected abstract readonly loadUrl: string;
    protected abstract readonly saveUrl: string;

    protected abstract afterLoad(data: any): void;

    protected readonly popupMsg: PopupMsgService = inject(PopupMsgService);

    protected get data(): any
    {
        return this.context.data;
    }

    protected readonly queryController: AbortController = new AbortController();

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }

    ngAfterViewInit(): void
    {
        this.load();
    }

    protected load(): void
    {
        if (!this.fetchExtraRequestOnLoad) {
            return;
        }

        let me: this = this,
            data: FormData = new FormData();

        if (this.data.id) {
            data.append('id', this.data.id.toString());
        }

        me.isLoading.set(true);
        new Fetcher().request({
            url: this.loadUrl,
            data: data,
            signal: this.queryController.signal,
            success: function (_response: any, _request: any, data: any): void {
                me.isLoading.set(false);

                me.afterLoad(data);
            },
            failure: function (code: any, message: any, _request: any): void {
                me.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                console.error(code);
                console.error(message);
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
            this.popupMsg.formInvalid();

            return;
        }

        let me: this = this,
            data: FormData = new FormData(),
            formValues: object = this.form.value;

        for (const [key, value] of Object.entries(formValues)) {
            let val: any = value;

            if (val instanceof Date) {
                val = Sftoomi.dateShort(value);
            }

            data.append(key, val);
        }

        if (this.data.id) {
            data.append('id', this.data.id.toString());
        }

        data = this.getAdditionalDataOnSave(data);

        me.isLoading.set(true);
        new Fetcher().request({
            url: this.saveUrl,
            data: data,
            signal: this.queryController.signal,
            success: function (_response: any, _request: any, data: any): void {
                me.isLoading.set(false);

                me.afterSave(data);
                me.context.completeWith({saved: true});
            },
            failure: function (code: any, message: any, _request: any): void {
                me.isLoading.set(false);

                if (message === 'canceled') {
                    return;
                }

                console.error(code);
                console.error(message);
            }
        })
    }

    protected afterSave(_data: any): void
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
