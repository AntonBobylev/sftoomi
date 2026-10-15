import Doctor from '../interfaces/Doctor';
import Facility from '../interfaces/Facility';

export default interface getFacilitiesAPI {
    data: (Facility & {
        facility_doctors: Doctor[]
    })[],
    total: number
}
