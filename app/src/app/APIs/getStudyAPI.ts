import Cpt from '../type/Cpt';
import Study from '../type/Study';

type getStudyAPI = {
    data:
        Study & {
        study_cpts: Cpt[]
    },
    lists: {
        cpts: Cpt[]
    }
};

export default getStudyAPI;
