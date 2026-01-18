import { AppContactsTableRecord } from '../components/fields/app-contacts/table/table.component';

import Group from '../type/Group'

type getUserAPI = {
    data: {
        id:                       number,
        login:                    string,
        last_name:                string | null,
        first_name:               string | null,
        disabled:                 boolean,
        force_to_change_password: boolean,
        contacts?: {
            contact_id: number,
            contacts:   AppContactsTableRecord[]
        },
        user_groups: Group[]
    },
    lists: {
        groups: Group[]
    }
};

export default getUserAPI;
