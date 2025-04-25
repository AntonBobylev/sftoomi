import { Component, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiError, TuiFlagPipe, TuiLabel, TuiTextfieldComponent, TuiTextfieldDirective } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputDateModule, TuiInputModule, TuiSelectModule, TuiTextfieldControllerModule, TuiUnfinishedValidator } from '@taiga-ui/legacy';
import { TUI_IS_IOS, TuiDay } from '@taiga-ui/cdk';
import { MaskitoOptions } from '@maskito/core';
import { maskitoGetCountryFromNumber, maskitoPhoneOptionsGenerator } from '@maskito/phone';
import { MaskitoDirective } from '@maskito/angular';
import metadata from 'libphonenumber-js/metadata.min.json';

import Sftoomi from '../../class/Sftoomi';

import OnlyLettersDirective from '../../directives/only-letters.directive';
import TuiDateToNativeTransformerDirective from '../../directives/tui-date-to-native.directive';
import UppercaseDirective from '../../directives/uppercase.directive';

export type PatientDemographicsTemplateControls = {
    first_name:  FormControl,
    last_name:   FormControl,
    middle_name: FormControl,
    dob:         FormControl,
    phone:       FormControl
};

@Component({
    selector: 'patient-demographics-template',
    templateUrl: './patient-demographics-template.component.html',
    imports: [
        AsyncPipe, OnlyLettersDirective, ReactiveFormsModule,
        TuiDateToNativeTransformerDirective, TuiError, TuiFieldErrorPipe,
        TuiFlagPipe, TuiInputDateModule, TuiInputModule, TuiLabel,
        TuiSelectModule, TuiTextfieldComponent, TuiTextfieldDirective,
        UppercaseDirective, TuiUnfinishedValidator,
        TuiTextfieldControllerModule, MaskitoDirective
    ],
    styleUrl: './patient-demographics-template.component.less'
})
export default class PatientDemographicsTemplateComponent
{
    @Input({required: true}) public controls!: PatientDemographicsTemplateControls;

    protected readonly TuiDay = TuiDay;
    protected readonly maxDobDate: Date = new Date();

    private readonly isIos: boolean = inject(TUI_IS_IOS);

    protected readonly mask: Required<MaskitoOptions> = maskitoPhoneOptionsGenerator({
        metadata,
        strict: false,
        countryIsoCode: 'RU'
    });

    protected get countryIsoCode(): string {
        return maskitoGetCountryFromNumber(this.controls.phone.value ?? '', metadata) ?? '';
    }

    protected get pattern(): string {
        return this.isIos ? '+[0-9-]{1,20}' : '';
    }

    protected readonly Sftoomi = Sftoomi;
}
