import { AppContactsTableRecord } from '../components/fields/app-contacts/app-contacts.component';

type getUserAPI = {
    data: {
        id: number,
        login: string,
        last_name: string | null,
        first_name: string | null,
        disabled: boolean,
        reset_password: boolean,
        force_to_change_password: boolean,
        contacts?: {
            contact_id: number,
            contacts: AppContactsTableRecord[]
        }
    }
};

export default getUserAPI;
