import { Component, input, InputSignal } from '@angular/core';
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
    public readonly opacityInPercents: InputSignal<number>  = input(70);
    public readonly isLoading:         InputSignal<boolean> = input(true);
}
