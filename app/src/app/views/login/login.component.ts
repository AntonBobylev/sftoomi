import { Component, signal, WritableSignal } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { NzButtonComponent } from 'ng-zorro-antd/button'

import { RoutesPaths } from '../../app.routes'
import AppBaseModule from '../../components/core/app-base-module'

import AppTextfieldComponent from '../../components/core/app-textfield/app-textfield.component'
import AppLoadingSpinnerComponent from '../../components/misc/app-loading-spinner/app-loading-spinner.component';
import LanguageSwitcherComponent from '../../components/misc/language-switcher/language-switcher.component';
import ResetPasswordDialogComponent from './reset-password-dialog/dialog.component'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        AppTextfieldComponent,
        NzButtonComponent,
        AppLoadingSpinnerComponent,
        LanguageSwitcherComponent
    ],
    styleUrl: './login.component.less'
})

export default class LoginComponent extends AppBaseModule
{
    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected form: FormGroup = new FormGroup({
        login:    new FormControl<string | null>(null, [Validators.required]),
        password: new FormControl<string | null>(null, [Validators.required])
    });

    constructor()
    {
        super();

        if (this.Sftoomi.Auth.getIsAuthorizedSignal()()) {
            this.goOut();
        }
    }

    protected onLogonClick(): void
    {
        if (this.form.invalid) {
            this.Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        this.Sftoomi.Auth.login(
            this.form.get('login')?.value,
            this.form.get('password')?.value,
            this.isLoading,
            (): void => {
                this.goOut();
            }
        );
    }

    protected onResetPasswordClick(event: PointerEvent): void
    {
        event.stopPropagation();
        event.preventDefault();

        const modal = this.Sftoomi.Dialog.getInstance().create({
            nzContent: ResetPasswordDialogComponent
        });

        modal.afterClose.subscribe((passwordReset: boolean = false): void => {
            if (passwordReset) {
                this.Sftoomi.popupMsgService?.info(
                    this.Sftoomi.Translator.translate('dialogs.reset_password.password_reset_message')
                );
            }
        });
    }

    private goOut(): void
    {
        if (window.history.state.last_route) {
            this.router.navigateByUrl(window.history.state.last_route).then();

            return;
        }

        this.router.navigateByUrl(RoutesPaths.HOME).then();
    }
}
