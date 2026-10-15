import { Component, effect, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { FormControl, Validators } from '@angular/forms';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseField from '../../core/base/app-base-field';

import { AppComboRecord } from '../../core/app-combo/app-combo.component';
import AppStudiesSelectorComboComponent from './app-studies-selector-combo/app-studies-selector-combo.component';

interface StudyCollectionRow {
    index:   number,
    store:   WritableSignal<AppComboRecord[]>,
    control: FormControl<number | null>
}

@Component({
    selector: 'app-studies-selector',
    templateUrl: './app-studies-selector.component.html',
    imports: [
        NzButtonComponent,
        NzIconDirective,
        AppStudiesSelectorComboComponent
    ],
    styleUrl: './app-studies-selector.component.less'
})

export default class AppStudiesSelectorComponent extends AppBaseField
{
    public override readonly label: InputSignal<string> = input(this.Sftoomi.Translator.translate('fields.studies_selector.caption'));

    public readonly storeSignal: InputSignal<WritableSignal<AppComboRecord[]>> = input.required({ alias: 'store' });

    protected studiesCollection: StudyCollectionRow[] = [];

    private lastIndex: number = 0;

    constructor()
    {
        super();

        effect((): void => {
            if (this.storeSignal()().length > 0) {
                this.updateStudiesStores();
                this.clearInvalidForceSelectedStudies();
            }
        });
    }

    public setValue(studyIds: (string | number)[]): void
    {
        studyIds
            .map((studyId: string | number): number => Number(studyId))
            .forEach((studyId: number, index: number): void => {
                this.addNewStudy();
                this.studiesCollection[index].control.setValue(studyId);
            });
    }

    public getAddedStudiesCount(): number
    {
        return this.studiesCollection.length;
    }

    public getAddedStudiesControls(): FormControl[]
    {
        return this.studiesCollection.map((record: StudyCollectionRow): FormControl => record.control);
    }

    protected onAddStudyClick(): void
    {
        this.addNewStudy();
    }

    protected onRemoveClick(studyIndex: number): void
    {
        this.form().removeControl('study' + studyIndex);
        Sftoomi.removeArrayItemByIndex(this.studiesCollection, this.studiesCollection.findIndex((study: StudyCollectionRow): boolean => study.index === studyIndex));

        this.updateStudiesStores();
    }

    protected isAddStudyClickDisabled(): boolean
    {
        return this.getAddedStudiesCount() >= this.storeSignal()().length;
    }

    private updateStudiesStores(): void
    {
        const alreadySelectedStudies: number[] = this.getAlreadySelectedStudies();

        this.studiesCollection.forEach((study: StudyCollectionRow): void => {
            const selectedValue: number | null = study.control.value,
                  studiesToExclude: number[] = alreadySelectedStudies.slice();
            if (selectedValue) {
                const currentStudyIndex: number = alreadySelectedStudies.findIndex((selectedStudy: number): boolean => selectedStudy == selectedValue);
                studiesToExclude.splice(currentStudyIndex, 1);
            }

            const filteredStudies: AppComboRecord[] = this.storeSignal()().filter((record: AppComboRecord): boolean => {
                let includes: boolean = false;
                studiesToExclude.forEach(study => {
                    if (record.value == study) {
                        includes = true;
                    }
                })

                return !includes;
            });

            study.store.set(filteredStudies);
        });
    }

    private getAlreadySelectedStudies(): number[]
    {
        const result: number[] = [];
        this.studiesCollection.forEach((study: StudyCollectionRow): void => {
            const selectedValue: number | null = study.control.value;
            if (!selectedValue) {
                return;
            }

            result.push(Number(selectedValue));
        });

        return result;
    }

    private addNewStudy(): void
    {
        const nextIndex: number = this.lastIndex + 1,
              control: FormControl<number | null> = new FormControl<number | null>(null, [Validators.required]);

        this.lastIndex = nextIndex;

        this.form().addControl('study' + nextIndex, control);
        this.studiesCollection.push({
            index: nextIndex,
            store: signal(this.storeSignal()()),
            control: control
        });

        control.valueChanges.subscribe((): void => this.updateStudiesStores());

        this.updateStudiesStores();
    }

    private clearInvalidForceSelectedStudies(): void
    {
        const alreadySelectedStudies: number[] = this.getAlreadySelectedStudies();
        if (Sftoomi.isEmpty(alreadySelectedStudies)) {
            return;
        }

        this.studiesCollection.forEach((study: StudyCollectionRow, index: number): void => {
            if (!study.control.value) {
                return;
            }

            const storeRecord: AppComboRecord | undefined = this.storeSignal()().find((record: AppComboRecord): boolean => record.value === study.control.value);
            if (storeRecord) { // exists
                return;
            }

            Sftoomi.removeArrayItemByIndex(this.studiesCollection, index);

            const controlName: string | undefined = Sftoomi.getFormControlName(study.control);
            if (controlName) {
                this.form().removeControl(controlName);
            }
        });
    }
}
