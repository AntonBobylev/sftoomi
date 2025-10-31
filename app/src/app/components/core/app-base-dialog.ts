import { computed, Directive, inject, OnDestroy, Signal, signal, WritableSignal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal'

import Sftoomi from '../../class/Sftoomi'

import ResponsiveLayoutService from '../../services/responsive-layout.service'

@Directive()
export default abstract class AppBaseDialog implements OnDestroy
{
    protected readonly data: any = inject(NZ_MODAL_DATA);

    protected abstract readonly form: FormGroup;

    protected readonly width: number | string | undefined;

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

    protected isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected readonly Sftoomi = Sftoomi;

    protected readonly queryController: AbortController = new AbortController();

    protected readonly responsiveLayoutService: ResponsiveLayoutService = inject(ResponsiveLayoutService);

    private readonly dialog: NzModalRef = inject(NzModalRef);

    ngOnDestroy(): void
    {
        this.queryController.abort();
    }

    protected getDialogInstance(): NzModalRef
    {
        return this.dialog;
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

    protected save(): void
    {
        this.close();
    }

    protected close(_result?: any): void
    {
        this.dialog.close();
    }
}
