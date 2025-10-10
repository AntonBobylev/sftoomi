import { Routes } from '@angular/router';

import Sftoomi from './class/Sftoomi';

import HomeComponent from './views/home/home.component';
import PatientsComponent from './views/patients/patients.component';
import ReferringFacilitiesComponent from './views/referring-facilities/referring-facilities.component';
import ReferringDoctorsComponent from './views/referring-doctors/referring-doctors.component';
import StudiesModuleComponent from './views/studies/studies.component';
import ExaminationsComponent from './views/examinations/examinations.component';
import LoginComponent from './views/login/login.component'
import UsersModuleComponent from './views/users/users.component';

const BASE_TITLE = 'SFTOOMI :: ';

export enum RoutesPaths {
    HOME = '',
    PATIENTS = 'patients',
    REFERRING_FACILITIES = 'referring-facilities',
    REFERRING_DOCTORS = 'referring-doctors',
    STUDIES = 'studies',
    EXAMINATIONS = 'examinations',
    LOGIN = 'login',
    USERS = 'users'
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
}, {
    path: RoutesPaths.REFERRING_DOCTORS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.setup.referring_doctors'),
    component: ReferringDoctorsComponent
}, {
    path: RoutesPaths.STUDIES,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.setup.studies'),
    component: StudiesModuleComponent
}, {
    path: RoutesPaths.EXAMINATIONS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.examinations'),
    component: ExaminationsComponent
}, {
    path: RoutesPaths.LOGIN,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.login'),
    component: LoginComponent
}, {
    path: RoutesPaths.USERS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.administration.users'),
    component: UsersModuleComponent
}];
