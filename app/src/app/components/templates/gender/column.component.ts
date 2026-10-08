import { Component } from '@angular/core';

import AppTableCommonColumn from '../../core/app-table/common-column.component';

@Component({
    selector: 'app-gender-column',
    templateUrl: './column.component.html',
    styleUrl: './column.component.less'
})
export default class AppGenderColumnComponent<Row extends { gender: 0 | 1 | null }, Table extends object> extends AppTableCommonColumn<Row, Table>
{
    protected getGenderIconData(): {
        id:             string,
        translationKey: string
    }
    {
        switch (this.rowData().gender) {
            case 0:
                return {
                    id: 'male',
                    translationKey: 'gender.male'
                };
            case 1:
                return {
                    id: 'female',
                    translationKey: 'gender.female'
                };
            case null:
                return {
                    id: 'unspecified',
                    translationKey: 'gender.unspecified'
                };
            default:
                return {
                    id: 'unknown',
                    translationKey: 'gender.unknown'
                };
        }
    }
}
