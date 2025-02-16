import { Component } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

export type PatientEditDialogData = {
    id: number
};

@Component({
    selector: 'patient-edit-dialog',
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})

export default class PatientEditDialogComponent
{
    public readonly context = injectContext<TuiDialogContext<PatientEditDialogData, PatientEditDialogData>>();

    protected get data(): PatientEditDialogData
    {
        return this.context.data;
    }
}
