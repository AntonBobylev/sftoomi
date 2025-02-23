import { Routes } from '@angular/router';

import HomeComponent from './components/views/home/home.component';
import PatientsComponent from './components/views/patients/patients.component';

export const routes: Routes = [{
    path: '',
    title: 'Home',
    component: HomeComponent
}, {
    path: 'patients',
    title: 'Patients',
    component: PatientsComponent
}];
