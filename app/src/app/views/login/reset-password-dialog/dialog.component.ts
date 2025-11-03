import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalFooterDirective } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';

import AppBaseDialog from '../../../components/core/app-base-dialog'

import { onlyLettersValidator } from '../../../validators/only-letters.validator';

@Component({
    selector: 'reset-password-dialog',
    templateUrl: './dialog.component.html',
    imports: [
        FormsModule, ReactiveFormsModule,
        NzButtonComponent, NzModalFooterDirective
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
}
