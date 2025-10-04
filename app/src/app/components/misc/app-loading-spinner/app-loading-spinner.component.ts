import { Component, Input } from '@angular/core';
import { NzSpinComponent } from 'ng-zorro-antd/spin'

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './app-loading-spinner.component.html',
    imports: [
        NzSpinComponent
    ],
    styleUrl: './app-loading-spinner.component.less'
})

export default class AppLoadingSpinnerComponent
{
    @Input({ required: true }) public isLoading: boolean = false;
}
