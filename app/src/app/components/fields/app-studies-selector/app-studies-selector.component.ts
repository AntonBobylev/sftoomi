import { Component, effect, Input, signal, WritableSignal } from '@angular/core'
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { FormControl, Validators } from '@angular/forms';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseField from '../../core/app-base-field';

import { AppComboRecord } from '../../core/app-combo/app-combo.component';
import AppStudiesSelectorComboComponent from './app-studies-selector-combo/app-studies-selector-combo.component';

type StudyCollectionRow = {
    index: number,
    store: WritableSignal<AppComboRecord[]>,
    control: FormControl<number | null>
};

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
    @Input() public override label: string = Sftoomi.Translator.translate('fields.studies_selector.caption');

    @Input({required: true}) public store: WritableSignal<AppComboRecord[]> = signal<AppComboRecord[]>([]);

    protected studiesCollection: StudyCollectionRow[] = [];

    private lastIndex: number = 0;

    constructor()
    {
        super();

        effect((): void => {
            if (this.store && this.store().length > 0) {
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
        this.form.removeControl('study' + studyIndex);
        Sftoomi.removeArrayItemByIndex(this.studiesCollection, this.studiesCollection.findIndex(function (study: StudyCollectionRow): boolean {
            return study.index === studyIndex;
        }));

        this.updateStudiesStores();
    }

    protected isAddStudyClickDisabled(): boolean
    {
        return this.getAddedStudiesCount() >= this.store().length;
    }

    private updateStudiesStores(): void
    {
        let alreadySelectedStudies: number[] = this.getAlreadySelectedStudies();

        this.studiesCollection.forEach((study: StudyCollectionRow): void => {
            let selectedValue: number | null = study.control.value,
                studiesToExclude: number[] = alreadySelectedStudies.slice();
            if (selectedValue) {
                let currentStudyIndex: number = alreadySelectedStudies.findIndex((selectedStudy: number): boolean => {
                    return selectedStudy == selectedValue;
                });

                studiesToExclude.splice(currentStudyIndex, 1);
            }

            let filteredStudies: AppComboRecord[] = this.store().filter(function (record: AppComboRecord): boolean {
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
        let result: number[] = [];
        this.studiesCollection.forEach(function (study: StudyCollectionRow): void {
            let selectedValue: number | null = study.control.value;
            if (!selectedValue) {
                return;
            }

            result.push(Number(selectedValue));
        });

        return result;
    }

    private addNewStudy(): void
    {
        let nextIndex: number = this.lastIndex + 1,
            control: FormControl<number | null> = new FormControl<number | null>(null, [Validators.required]);

        this.lastIndex = nextIndex;

        this.form.addControl('study' + nextIndex, control);
        this.studiesCollection.push({
            index: nextIndex,
            store: signal(this.store()),
            control: control
        });

        control.valueChanges.subscribe((): void => this.updateStudiesStores());

        this.updateStudiesStores();
    }

    private clearInvalidForceSelectedStudies(): void
    {
        let alreadySelectedStudies: number[] = this.getAlreadySelectedStudies();
        if (Sftoomi.isEmpty(alreadySelectedStudies)) {
            return;
        }

        this.studiesCollection.forEach((study: StudyCollectionRow, index: number): void => {
            if (!study.control.value) {
                return;
            }

            let storeRecord: AppComboRecord | undefined = this.store().find(function (record: AppComboRecord): boolean {
                return record.value === study.control.value;
            });

            if (storeRecord) { // exists
                return;
            }

            Sftoomi.removeArrayItemByIndex(this.studiesCollection, index);

            let controlName: string | undefined = Sftoomi.getFormControlName(study.control);
            if (controlName) {
                this.form.removeControl(controlName);
            }
        });
    }
}
