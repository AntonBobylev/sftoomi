import { Routes } from '@angular/router';

import Sftoomi from './class/Sftoomi';
import HomeComponent from './views/home/home.component';
import PatientsComponent from './views/patients/patients.component';

const BASE_TITLE = 'SFTOOMI :: ';

export enum RoutesPaths {
    HOME = '',
    PATIENTS = 'patients'
}

export const routes: Routes = [{
    path: RoutesPaths.HOME,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.home'),
    component: HomeComponent
}, {
    path: RoutesPaths.PATIENTS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.patients'),
    component: PatientsComponent
}];
