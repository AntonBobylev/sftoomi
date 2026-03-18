import { Directive, Signal } from '@angular/core'

import Sftoomi from '../../class/Sftoomi'

import AppBaseModule from './app-base-module'
import AppBaseFilters from './app-base-filters'

import AppTableComponent from './app-table/app-table.component'

@Directive()
export default abstract class AppBaseModuleWithFilters extends AppBaseModule
{
    protected abstract readonly filtersCtrl: Signal<AppBaseFilters>;
    protected abstract readonly tableCtrl: Signal<AppTableComponent>;

    protected abstract filtersLoaded(values: object): void;
    protected abstract onSearch(values: object): void;
    protected abstract onClear(values: object): void;

    protected search(values: object): void
    {
        this.tableCtrl().setIsLoading(true);
        this.tableCtrl().refresh(Sftoomi.formValuesToFormData(values));
    }
}
