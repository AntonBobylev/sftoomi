import { Component, signal, WritableSignal } from '@angular/core'
import { Router } from '@angular/router'
import Sftoomi from '../../class/Sftoomi'
import { RoutesPaths } from '../../app.routes'
import AppTextfieldComponent from '../../components/core/app-textfield/app-textfield.component'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import Fetcher from '../../class/Fetcher'
import { DialogType } from '../../class/Dialog'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        AppTextfieldComponent,
        NzButtonComponent
    ],
    styleUrl: './login.component.less'
})

export default class LoginComponent
{
    protected readonly Sftoomi = Sftoomi

    protected readonly logonUrl: string = '/login';

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected form: FormGroup = new FormGroup({
        login:    new FormControl<string | null>(null, [Validators.required]),
        password: new FormControl<string | null>(null, [Validators.required])
    });

    constructor(private readonly router: Router)
    {
        if (Sftoomi.Auth.isAuthorized()) {
            this.goOut();
        }
    }

    protected onLogonClick(): void
    {
        if (this.form.invalid) {
            Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        let data: FormData = new FormData();

        data.append('login', this.form.get('login')?.value);
        data.append('password', this.form.get('password')?.value);

        this.isLoading.set(true);
        new Fetcher().request({
            url: this.logonUrl,
            data: data,
            success: (_response: any, _request: any, result: any): void => {
                if (!result.success) {
                    Sftoomi.Dialog.show(result.error, DialogType.ERROR);

                    return;
                }

                Sftoomi.Auth.authorize(result.session_id, result.user.id);
                this.goOut();
            },
            failure: (_code: any, message: any, _request: any): void => {
                Sftoomi.Dialog.show(message, DialogType.ERROR);
            },
            finally: (): void => {
                this.isLoading.set(false);
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
