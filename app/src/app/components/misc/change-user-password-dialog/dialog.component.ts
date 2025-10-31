import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalFooterDirective } from 'ng-zorro-antd/modal'
import { NzButtonComponent } from 'ng-zorro-antd/button'

import Sftoomi from '../../../class/Sftoomi'
import { DialogType } from '../../../class/Dialog'
import Fetcher from '../../../class/Fetcher'

import AppTextfieldComponent from '../../../components/core/app-textfield/app-textfield.component';
import AppLoadingSpinnerComponent from '../app-loading-spinner/app-loading-spinner.component'

import AppBaseDialog from '../../core/app-base-dialog'
import changePasswordAPI from '../../../APIs/changePasswordAPI'

@Component({
    selector: 'change-user-password-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        AppTextfieldComponent,
        NzButtonComponent,
        NzModalFooterDirective,
        AppLoadingSpinnerComponent
    ],
    styleUrl: './dialog.component.less'
})

export default class AppChangeUserPasswordDialog extends AppBaseDialog implements OnInit, AfterViewInit
{
    protected override readonly form: FormGroup = new FormGroup({
        old_password:              new FormControl<string | null>(null, [Validators.required]),
        new_password:              new FormControl<string | null>(null, [Validators.required]),
        new_password_confirmation: new FormControl<string | null>(null, [Validators.required])
    });

    protected override readonly width: string | number | undefined = 300;

    private readonly changePasswordUrl: string = '/changePassword';

    ngOnInit(): void
    {
        setTimeout((): void => {
            this.getDialogInstance().updateConfig({
                nzTitle: Sftoomi.Translator.translate('dialogs.change_password.title'),
                nzMaskClosable: false,
                nzClosable: false,
                nzCentered: true
            });
        });
    }

    ngAfterViewInit(): void
    {
        Sftoomi.popupMsgService?.show(Sftoomi.Translator.translate('dialogs.change_password.change_password_tip'));
    }

    protected override save(): void
    {
        this.validate();
        if (this.form.invalid) {
            Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        let formValues: any = this.form.value,
            data: FormData = Sftoomi.formValuesToFormData(formValues);

        data.append('user_id', Sftoomi.Auth.getUser()!.id.toString());

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.changePasswordUrl,
            data: data,
            signal: this.queryController.signal,
            success: (_response: any, _request: any, result: changePasswordAPI): void => {
                if (result.success) {
                    this.close();

                    return;
                }

                Sftoomi.Dialog.show(result.message!, DialogType.ERROR);
            },
            failure: (_code: any, message: any, _request: any): void => {
                if (message === 'canceled') {
                    return;
                }

                Sftoomi.Dialog.show(message, DialogType.ERROR, (): void => this.getDialogInstance().close())
            },
            finally: (): void => {
                this.isLoading.set(false);
            }
        })
    }
}
