import { AppComboRecord } from '../components/core/app-combo/app-combo.component';

import Study from '../type/Study';

type getStudyAPI = {
    data:
        Study & {
        study_cpts: AppComboRecord[]
    }
};

export default getStudyAPI;
