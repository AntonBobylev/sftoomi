import { Routes } from '@angular/router';

import Sftoomi from './class/Sftoomi';

import HomeComponent from './components/views/home/home.component';
import PatientsComponent from './components/views/patients/patients.component';
import FacilitiesComponent from './components/views/facilities/facilities.component';

const BASE_TITLE = 'SFTOOMI :: ';

export enum RoutesPaths {
    HOME = '',
    PATIENTS = 'patients',
    FACILITIES = 'facilities'
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
    path: RoutesPaths.FACILITIES,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.facilities'),
    component: FacilitiesComponent
}];


