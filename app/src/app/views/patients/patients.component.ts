import { Component, signal, WritableSignal } from '@angular/core';
import { NzTableComponent, NzTdAddOnComponent, NzThMeasureDirective, NzThSelectionComponent } from 'ng-zorro-antd/table';

import Sftoomi from '../../class/Sftoomi';
import Fetcher from '../../class/Fetcher';
import getPatientsAPI from '../../APIs/getPatientsAPI';

@Component({
    selector: 'app-patients',
    imports: [
        NzTableComponent,
        NzThMeasureDirective,
        NzThSelectionComponent,
        NzTdAddOnComponent
    ],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.scss'
})

export default class PatientsComponent
{
    checked = false;
    indeterminate = false

    listOfCurrentPageData: readonly any[] = [];
    setOfCheckedId = new Set<number>();

    protected readonly Sftoomi = Sftoomi;

    protected data: WritableSignal<any[]> = signal<any[]>([]);

    ngAfterViewInit(): void
    {
        new Fetcher().request({
            url: '/getPatients',
            success: (_response: any, _request: any, result: getPatientsAPI): void => {
                this.data.set(result.data);
            }
        });
    }

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
        this.listOfCurrentPageData = listOfCurrentPageData;
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
        this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
        this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(checked: boolean): void {
        this.listOfCurrentPageData
            .filter(({ disabled }) => !disabled)
            .forEach(({ id }) => this.updateCheckedSet(id, checked));
        this.refreshCheckedStatus();
    }
}
