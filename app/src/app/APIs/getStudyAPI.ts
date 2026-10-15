import { AppComboRecord } from '../components/core/app-combo/app-combo.component';

import Study from '../interfaces/Study';

export default interface getStudyAPI {
    data:
        Study & {
        study_cpts: AppComboRecord[]
    }
}
