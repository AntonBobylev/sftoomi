import { inject, Injectable } from '@angular/core';
import { NzMessageService, NzMessageType } from 'ng-zorro-antd/message';

import Sftoomi from '../class/Sftoomi';

@Injectable({
    providedIn: 'root'
})
export default class PopupMsgService
{
    private readonly popupMsg: NzMessageService = inject(NzMessageService);

    private readonly defaultTimeout: number = 5000; // ms

    public show(msg: string, timeoutMs?: number, callback?: Function, type: NzMessageType = 'info'): void
    {
        this.popupMsg.create(
            type,
            msg,
            {
                nzDuration: timeoutMs ?? this.defaultTimeout,
                nzAnimate: true,
                nzPauseOnHover: true
            }
        ).onClose.subscribe((): void => {
            if (callback) {
                callback();
            }
        });
    }

    public info(msg: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, timeoutMs, callback, 'info');
    }

    public warning(msg: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, timeoutMs, callback, 'warning');
    }

    public error(msg: string, timeoutMs?: number, callback?: Function): void
    {
        this.show(msg, timeoutMs, callback, 'error');
    }

    public nothingSelected(timeoutMs?: number): void
    {
        this.warning(Sftoomi.Translator.translate('popup.nothing_selected'), timeoutMs);
    }

    public moreThanOneSelected(timeoutMs?: number): void
    {
        this.warning(Sftoomi.Translator.translate('popup.more_than_one_selected'), timeoutMs);
    }

    public formInvalid(timeoutMs?: number): void
    {
        this.warning(Sftoomi.Translator.translate('popup.form_invalid'), timeoutMs);
    }
}
