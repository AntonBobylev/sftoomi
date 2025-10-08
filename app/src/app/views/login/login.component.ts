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


    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    protected form: FormGroup = new FormGroup({
        login:    new FormControl<string | null>(null, [Validators.required]),
        password: new FormControl<string | null>(null, [Validators.required])
    });

    constructor(private readonly router: Router)
    {
        if (Sftoomi.Auth.getIsAuthorizedSignal()()) {
            this.goOut();
        }
    }

    protected onLogonClick(): void
    {
        if (this.form.invalid) {
            Sftoomi.popupMsgService?.formInvalid();

            return;
        }

        Sftoomi.Auth.login(
            this.form.get('login')?.value,
            this.form.get('password')?.value,
            this.isLoading,
            (): void => {
                this.goOut();
            }
        );
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
