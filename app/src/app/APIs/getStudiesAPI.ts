import Study from '../interfaces/Study';
import Cpt from '../interfaces/Cpt';

export default interface getStudiesAPI {
    data: (Study & {
        study_cpts: Cpt[]
    })[],
    total: number
}
