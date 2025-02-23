import { Routes } from '@angular/router';

import Sftoomi from './class/Sftoomi';

import HomeComponent from './components/views/home/home.component';
import PatientsComponent from './components/views/patients/patients.component';
import FacilitiesComponent from './components/views/facilities/facilities.component';

export enum RoutesPaths {
    HOME = '',
    PATIENTS = 'patients',
    FACILITIES = 'facilities'
}

export const routes: Routes = [{
    path: RoutesPaths.HOME,
    title: Sftoomi.Translator.translate('navigation.home'),
    component: HomeComponent
}, {
    path: RoutesPaths.PATIENTS,
    title: Sftoomi.Translator.translate('navigation.patients'),
    component: PatientsComponent
}, {
    path: RoutesPaths.FACILITIES,
    title: Sftoomi.Translator.translate('navigation.facilities'),
    component: FacilitiesComponent
}];


