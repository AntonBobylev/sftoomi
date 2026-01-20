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
import GroupsComponent from './views/groups/groups.component'
import ReportTemplatesModuleComponent from './views/report-templates/module.component'

export enum RoutesPaths {
    EXAMINATIONS         = 'examinations',
    GROUPS               = 'groups',
    HOME                 = '',
    LOGIN                = 'login',
    PATIENTS             = 'patients',
    REFERRING_DOCTORS    = 'referring-doctors',
    REFERRING_FACILITIES = 'referring-facilities',
    REPORT_TEMPLATES     = 'report-templates',
    STUDIES              = 'studies',
    USERS                = 'users'
}

const BASE_TITLE = 'SFTOOMI :: ';
const fallbackRoutePath: string = RoutesPaths.HOME;

export const routes: Routes = [{
    path: RoutesPaths.EXAMINATIONS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.examinations'),
    component: ExaminationsComponent
}, {
    path: RoutesPaths.GROUPS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.administration.groups'),
    component: GroupsComponent
}, {
    path: RoutesPaths.HOME,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.home'),
    component: HomeComponent
}, {
    path: RoutesPaths.LOGIN,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.login'),
    component: LoginComponent
}, {
    path: RoutesPaths.PATIENTS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.patients'),
    component: PatientsComponent
}, {
    path: RoutesPaths.REFERRING_DOCTORS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.setup.referring_doctors'),
    component: ReferringDoctorsComponent
}, {
    path: RoutesPaths.REFERRING_FACILITIES,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.setup.referring_facilities'),
    component: ReferringFacilitiesComponent
}, {
    path: RoutesPaths.REPORT_TEMPLATES,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.setup.report_templates'),
    component: ReportTemplatesModuleComponent
}, {
    path: RoutesPaths.STUDIES,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.setup.studies'),
    component: StudiesModuleComponent
}, {
    path: RoutesPaths.USERS,
    title: BASE_TITLE + Sftoomi.Translator.translate('navigation.administration.users'),
    component: UsersModuleComponent
}, {
    path: '**', // ATTENTION: MUST BE THE LAST ONE
    redirectTo: fallbackRoutePath
}];

export const RoutesPermissions: Map<string, string | undefined> = new Map([[
    RoutesPaths.EXAMINATIONS,
    'EXAMINATIONS_MODULE'
], [
    RoutesPaths.GROUPS,
    'GROUPS_MODULE'
], [
    RoutesPaths.HOME,
    'GROUPS_MODULE'
], [
    RoutesPaths.LOGIN,
    undefined
], [
    RoutesPaths.PATIENTS,
    'PATIENTS_MODULE'
], [
    RoutesPaths.REFERRING_DOCTORS,
    'REFERRING_DOCTORS_MODULE'
], [
    RoutesPaths.REFERRING_FACILITIES,
    'REFERRING_FACILITIES_MODULE'
], [
    RoutesPaths.REPORT_TEMPLATES,
    'REPORT_TEMPLATES_MODULE'
], [
    RoutesPaths.STUDIES,
    'STUDIES_MODULE'
], [
    RoutesPaths.USERS,
    'USERS_MODULE'
]]);
