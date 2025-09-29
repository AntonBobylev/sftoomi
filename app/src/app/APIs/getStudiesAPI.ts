import Study from '../type/Study';
import Cpt from '../type/Cpt';

type getStudiesAPI = {
    data: (Study & {
        study_cpts: Cpt[]
    })[],
    total: number
};

export default getStudiesAPI;
