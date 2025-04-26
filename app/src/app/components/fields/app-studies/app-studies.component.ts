import { AfterViewInit, Component, effect, Input, signal, WritableSignal } from '@angular/core'
import { TuiButton, TuiHintDirective } from '@taiga-ui/core';
import { TuiElasticContainer } from '@taiga-ui/kit';
import { FormControl, Validators } from '@angular/forms';

import Sftoomi from '../../../class/Sftoomi';

import AppBaseField from '../app-base-field';

import AppComboBoxComponent, { AppComboboxRecord } from '../app-combo-box/app-combo-box.component';

type StudyCollectionRow = {
    index: number,
    store: WritableSignal<AppComboboxRecord[]>,
    control: FormControl<string | null>
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

export default class AppStudiesComponent extends AppBaseField implements AfterViewInit
{
    @Input() public override label: string = Sftoomi.Translator.translate('studies');
    @Input() public initialValues: (string | number)[] = [];

    @Input({required: true}) public store: WritableSignal<AppComboboxRecord[]> = signal<AppComboboxRecord[]>([]);

    protected studiesCollection: StudyCollectionRow[] = [];

    private lastIndex: number = 0;

    constructor()
    {
        super();

        let me: this = this;
        effect((): void => {
            if (me.store && me.store().length > 0) {
                me.updateStudiesStores();
                me.clearInvalidForceSelectedStudies();
            }
        });
    }


    public ngAfterViewInit(): void
    {
        let me: this = this;
        this.initialValues.forEach(function (studyId: string | number, index: number): void {
            me.addNewStudy();
            me.studiesCollection[index].control.setValue(studyId.toString());
        });
    }

    public getAddedStudiesCount(): number
    {
        return this.studiesCollection.length;
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
    }

    protected isAddStudyClickDisabled(): boolean
    {
        return this.getAddedStudiesCount() >= this.store().length;
    }

    private updateStudiesStores(): void
    {
        let me: this = this,
            alreadySelectedStudies: string[] = this.getAlreadySelectedStudies();

        this.studiesCollection.forEach(function (study: StudyCollectionRow): void {
            let selectedValue: string | null = study.control.value,
                studiesToExclude: string[] = alreadySelectedStudies.slice();
            if (selectedValue) {
                let currentStudyIndex: number = alreadySelectedStudies.findIndex(function (selectedStudy: string): boolean {
                    return selectedStudy === selectedValue;
                });

                studiesToExclude.splice(currentStudyIndex, 1);
            }

            let filteredStudies: AppComboboxRecord[] = me.store().filter(function (record: AppComboboxRecord): boolean {
                return !studiesToExclude.includes(record.value.toString());
            });

            study.store.set(filteredStudies);
        });
    }

    private getAlreadySelectedStudies(): string[]
    {
        let result: string[] = [];
        this.studiesCollection.forEach(function (study: StudyCollectionRow): void {
            let selectedValue: string | null = study.control.value;
            if (!selectedValue) {
                return;
            }

            result.push(selectedValue);
        });

        return result;
    }

    private addNewStudy(): void
    {
        let nextIndex: number = this.lastIndex + 1,
            control: FormControl<string | null> = new FormControl<string | null>(null, [Validators.required]);

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
        let me: this = this,
            alreadySelectedStudies: string[] = this.getAlreadySelectedStudies();

        if (Sftoomi.isEmpty(alreadySelectedStudies)) {
            return;
        }

        this.studiesCollection.forEach(function (study: StudyCollectionRow, index: number): void {
            if (!study.control.value) {
                return;
            }

            let storeRecord: AppComboboxRecord | undefined = me.store().find(function (record: AppComboboxRecord): boolean {
                return record.value.toString() === study.control.value!.toString();
            });

            if (storeRecord) { // exists
                return;
            }

            Sftoomi.removeArrayItemByIndex(me.studiesCollection, index);
        });
    }
}
