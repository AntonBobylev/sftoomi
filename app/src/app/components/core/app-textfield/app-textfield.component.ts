import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzIconDirective } from 'ng-zorro-antd/icon';

import Sftoomi from '../../../class/Sftoomi';

import FormErrorTemplateComponent from '../../templates/form-error-template/form-error-template.component';

@Component({
    selector: 'app-textfield',
    templateUrl: './app-textfield.component.html',
    imports: [
        NzFormItemComponent, FormErrorTemplateComponent,
        NzColDirective, NzFormControlComponent, NzFormLabelComponent,
        NzInputGroupComponent, ReactiveFormsModule, NgTemplateOutlet,
        NzIconDirective, NzInputDirective
    ],
    styleUrl: './app-textfield.component.scss'
})

export default class AppTextfieldComponent
{
    @Input({required: true}) public form!: FormGroup;
    @Input({required: true}) public name!: string;
    @Input({required: true}) public label!: string;

    @Input() public useUppercase: boolean = false;

    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();

    protected readonly Sftoomi = Sftoomi;

    protected onInput(event: any): void
    {
        if (!this.form.get(this.name)?.value) {
            this.onChange.emit(event.data);

            return;
        }

        if (this.useUppercase) {
            this.form.get(this.name)!.setValue((this.form.get(this.name)?.value).toUpperCase());
        }

        this.onChange.emit(event.data);
    }
}
