import { Routes } from '@angular/router';

import Sftoomi from './class/Sftoomi';

import HomeComponent from './views/home/home.component';
import PatientsComponent from './views/patients/patients.component';
import ReferringFacilitiesComponent from './views/referring-facilities/referring-facilities.component';

const BASE_TITLE = 'SFTOOMI :: ';

export enum RoutesPaths {
    HOME = '',
    PATIENTS = 'patients',
    REFERRING_FACILITIES = 'referring-facilities'
}

export const routes: Routes = [{
    path: RoutesPaths.HOME,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.home'),
    component: HomeComponent
}, {
    path: RoutesPaths.PATIENTS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.patients'),
    component: PatientsComponent
}, {
    path: RoutesPaths.REFERRING_FACILITIES,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.setup.referring_facilities'),
    component: ReferringFacilitiesComponent
}];
