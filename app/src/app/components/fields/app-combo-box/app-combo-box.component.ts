import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiComboBoxModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiDataListWrapper, TuiDataListWrapperComponent, TuiFieldErrorPipe, TuiFilterByInputPipe, TuiStringifyContentPipe } from '@taiga-ui/kit';
import { TuiError } from '@taiga-ui/core';

import Sftoomi from '../../../class/Sftoomi';

export type AppComboboxRecord = {
    value: string | number,
    title: string
};

@Component({
    selector: 'app-combo-box',
    templateUrl: './app-combo-box.component.html',
    imports: [
        AsyncPipe, ReactiveFormsModule,
        TuiComboBoxModule, TuiDataListWrapper,
        TuiDataListWrapperComponent, TuiError,
        TuiFieldErrorPipe, TuiFilterByInputPipe,
        TuiStringifyContentPipe, TuiTextfieldControllerModule,
    ],
    styleUrl: './app-combo-box.component.scss'
})

export default class AppComboBoxComponent implements OnInit
{
    @Input({required: true}) public label!: string;
    @Input({required: true}) public name!: string;
    @Input({required: true, alias: 'parentFormGroup'}) public form!: FormGroup;
    @Input({required: true}) public store: WritableSignal<AppComboboxRecord[]> = signal([]);

    protected readonly Sftoomi = Sftoomi;

    protected readonly stringify = (value: number): string =>
        this.store().find(function (item: AppComboboxRecord): boolean {
            return item.value.toString() === value.toString();
        })?.title || '';

    protected items: string[] = [];

    ngOnInit(): void
    {
        this.items = this.store().map(({value}: AppComboboxRecord): string => value.toString());
    }
}
