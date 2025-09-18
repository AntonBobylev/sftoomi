import { Routes } from '@angular/router';

import Sftoomi from './class/Sftoomi';
import HomeComponent from './views/home/home.component';
import PatientsComponent from './views/patients/patients.component';

const BASE_TITLE = 'SFTOOMI :: ';

export enum RoutesPaths {
    HOME = '',
    PROCESSING = 'processing',
    PATIENTS = 'patients',
    FACILITIES = 'facilities',
    DOCTORS = 'doctors',
    STUDIES = 'studies',
    TEMPLATE = 'template',
    TEMPLATES = 'templates',
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

// export const routes: Routes = [{
//     path: RoutesPaths.PROCESSING,
//     title: BASE_TITLE + Sftoomi.Translator.translate('navigation.processing'),
//     component: ProcessingComponent
// }, {
//     path: RoutesPaths.FACILITIES,
//     title: BASE_TITLE + Sftoomi.Translator.translate('navigation.facilities'),
//     component: FacilitiesComponent
// }, {
//     path: RoutesPaths.DOCTORS,
//     title: BASE_TITLE + Sftoomi.Translator.translate('navigation.doctors'),
//     component: DoctorsComponent
// }, {
//     path: RoutesPaths.STUDIES,
//     title: BASE_TITLE + Sftoomi.Translator.translate('navigation.studies'),
//     component: StudiesComponent
// }, {
//     path: RoutesPaths.TEMPLATE,
//     title: BASE_TITLE + Sftoomi.Translator.translate('navigation.template'),
//     component: TemplateComponent
// }, {
//     path: RoutesPaths.TEMPLATES,
//     title: BASE_TITLE + Sftoomi.Translator.translate('navigation.templates'),
//     component: TemplatesModuleComponent
// }];
