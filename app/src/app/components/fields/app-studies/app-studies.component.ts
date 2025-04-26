import { Component, Input, signal, WritableSignal } from '@angular/core'
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';
import { TuiElasticContainer } from '@taiga-ui/kit';
import { FormControl, Validators } from '@angular/forms';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseField from '../app-base-field';

import AppComboBoxComponent, { AppComboboxRecord } from '../app-combo-box/app-combo-box.component';

type StudyCollectionRow = {
    index: number
};

@Component({
    selector: 'app-studies',
    templateUrl: './app-studies.component.html',
    imports: [
        AppComboBoxComponent,
        TuiButton,
        TuiElasticContainer,
        TuiHintDirective
    ],
    styleUrl: './app-studies.component.scss'
})

export default class AppStudiesComponent extends AppBaseField
{
    @Input() public override label: string = 'Studies';

    @Input({required: true}) public store: WritableSignal<AppComboboxRecord[]> = signal<AppComboboxRecord[]>([]);

    protected studiesCollection: StudyCollectionRow[] = [];

    private lastIndex: number = 0;

    protected onAddStudyClick(): void
    {
        let nextIndex: number = this.lastIndex + 1;
        this.lastIndex = nextIndex;

        this.form.addControl('study' + nextIndex, new FormControl<string | null>(null, [Validators.required]));
        this.studiesCollection.push({index: nextIndex});
    }

    protected onRemoveClick(studyIndex: number): void
    {
        this.form.removeControl('study' + studyIndex);
        Sftoomi.removeArrayItemByIndex(this.studiesCollection, this.studiesCollection.findIndex(function (study: StudyCollectionRow): boolean {
            return study.index === studyIndex;
        }));
    }
}
