import { computed, Directive, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal'

import Sftoomi from '../../class/Sftoomi'

import ResponsiveLayoutService from '../../services/responsive-layout.service'

@Directive()
export default abstract class AppBaseDialog implements OnInit, OnDestroy
{
    protected readonly data: any = inject(NZ_MODAL_DATA);

    protected abstract readonly form: FormGroup;

    protected readonly title: string = '';
    protected readonly isClosableMask: boolean = false;
    protected readonly isClosable: boolean = true;
    protected readonly isCentered: boolean = true;
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

    ngOnInit(): void
    {
        setTimeout((): void => {
            debugger;
            if (!Sftoomi.isEmpty(this.title)) {
                this.getDialogInstance().updateConfig({
                    nzTitle: this.title,
                });
            }

            this.getDialogInstance().updateConfig({
                nzMaskClosable: this.isClosableMask,
                nzClosable: this.isClosable,
                nzCentered: this.isCentered
            });
        });
    }

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
        if (!this.isPreValid()) {
            return;
        }

        this.validate();
        if (this.form.invalid) {
            Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        this.close();
    }

    protected close(_result?: any): void
    {
        this.dialog.close();
    }
}
