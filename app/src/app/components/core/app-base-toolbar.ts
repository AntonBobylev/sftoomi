import { Directive, inject, Input, OnDestroy } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';

import Sftoomi from '../../class/Sftoomi';

import AppTableComponent from './app-table/app-table.component';

import PopupMsgService from '../../services/popup-msg.service';

@Directive()
export default abstract class AppBaseToolbar implements OnDestroy
{
    @Input({required: true}) public readonly table!: AppTableComponent;

    protected readonly Sftoomi: typeof Sftoomi = Sftoomi;

    protected readonly popupMsg: PopupMsgService = inject(PopupMsgService);
    protected readonly dialog: TuiDialogService = inject(TuiDialogService);

    protected readonly queryController: AbortController = new AbortController();

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }
}
