import { Component, input,  InputSignal, OnInit } from '@angular/core';

import AppComboImports from './app-combo/imports';

import AppComboComponent from './app-combo/app-combo.component';

import Gender from '../../type/Gender';

@Component({
    selector: 'app-gender-combo',
    templateUrl: './app-combo/app-combo.component.html',
    styleUrl: './app-combo/app-combo.component.scss',
    imports: AppComboImports
})
export default class AppGenderComboComponent extends AppComboComponent<Gender> implements OnInit
{
    public override readonly label: InputSignal<string> = input(this.Sftoomi.Translator.translate('gender.caption'));

    ngOnInit(): void
    {
        this.setData([{
            value: 0,
            caption: this.Sftoomi.Translator.translate('gender.male')
        }, {
            value: 1,
            caption: this.Sftoomi.Translator.translate('gender.female')
        }, {
            value: -1,
            caption: this.Sftoomi.Translator.translate('gender.unspecified')
        }])
    }
}
