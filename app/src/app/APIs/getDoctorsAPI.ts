import Doctor from '../interfaces/Doctor';
import Facility from '../interfaces/Facility';

export default interface getDoctorsAPI {
    data: (Doctor & {
        doctor_facilities: Facility[]
    })[],
    total: number
}
