import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import AppBaseDialog from '../../../components/core/app-base-dialog'
import Fetcher from '../../../class/Fetcher'
import Sftoomi from '../../../class/Sftoomi'
import { DialogType } from '../../../class/Dialog'

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component'
import AppLoadingSpinnerComponent from '../../../components/misc/app-loading-spinner/app-loading-spinner.component'

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

import OnlyLettersDirective from '../../../directives/only-letters.directive'

@Component({
    selector: 'reset-password-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective,
        AppTextfieldComponent, OnlyLettersDirective,
        AppLoadingSpinnerComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class ResetPasswordDialogComponent extends AppBaseDialog implements OnInit
{
    protected override readonly width: number | string | undefined = 300;

    protected readonly form: FormGroup = new FormGroup({
        login: new FormControl<string | null>(null, [Validators.required, onlyLettersValidator()]),
        email: new FormControl<string | null>(null, [Validators.required, Validators.email])
    });

    protected override readonly title: string = this.Sftoomi.Translator.translate('dialogs.reset_password.title');

    private readonly resetPasswordUrl: string = '/resetPassword';

    protected override save(): void
    {
        if (!this.isPreValid()) {
            return;
        }

        this.validate();
        if (this.form.invalid) {
            this.Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.resetPasswordUrl,
            data: Sftoomi.formValuesToFormData(this.form.value),
            success: (_response: any, _request: any, _data: any): void => {
                this.close(true);
            },
            failure: function (_code: any, message: any, _request: any): void {
                Sftoomi.Dialog.show(message, DialogType.ERROR);
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        })
    }
}
