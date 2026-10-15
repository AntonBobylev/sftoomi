import Doctor from '../interfaces/Doctor';
import Facility from '../interfaces/Facility';

export default interface getFacilityAPI {
    data: Facility & {
        facility_doctors: Doctor[]
    },
    lists: {
        doctors: Doctor[]
    }
}
