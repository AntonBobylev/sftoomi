import { Component, input, InputSignal } from '@angular/core';
import { NzTableComponent, NzThMeasureDirective } from 'ng-zorro-antd/table';

import AppTableColumn from '../../../type/AppTableColumn';
import { SafePipe } from '../../../pipes/safe.pipe';

@Component({
    selector: 'app-table',
    templateUrl: './app-table.component.html',
    imports: [
        NzTableComponent,
        NzThMeasureDirective,
        SafePipe
    ],
    styleUrl: './app-table.component.scss'
})

export default class AppTableComponent
{
    protected data: InputSignal<any[]> = input<any[]>([]);

    protected columns: InputSignal<AppTableColumn[]> = input<AppTableColumn[]>([]);

}
