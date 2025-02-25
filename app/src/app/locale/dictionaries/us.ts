let usDictionary: object =  {
    add: 'Add',
    dob: 'DoB',
    dob_full: 'Date of birth',
    edit: 'Edit',
    error: 'Error',
    first_name: 'First name',
    full_name: 'Full name',
    id: 'ID',
    information: 'Information',
    last_name: 'Last name',
    middle_name: 'Middle name',
    no_data_to_display: 'No data to display',
    phone: 'Phone',
    refresh: 'Refresh',
    remove: 'Remove',
    save: 'Save',
    select_all: 'Select all',
    short_name: 'Short name',
    switch_language: 'Switch language',
    switch_theme: 'Switch theme',
    warning: 'Warning',

    navigation: {
        doctors: 'Doctors',
        facilities: 'Facilities',
        home: 'Home',
        patients: 'Patients'
    },

    base_table: {
        items_per_page: 'items per page',
        rows: 'rows'
    },

    views: {
        patients: {
            table: {
                columns: {
                    dob: {
                        width: '120px'
                    }
                }
            },
            dialog: {
                add_title: 'Add patient',
                edit_title: 'Edit patient #{0}'
            }
        },
        facilities: {
            table: {
                columns: {
                    doctors: 'Doctors'
                }
            },
            dialog: {
                add_title: 'Add facility',
                edit_title: 'Edit facility #{0}'
            }
        },
        doctors: {
            table: {
                columns: {
                    facilities: 'Facilities'
                }
            },
            dialog: {
                add_title: 'Add doctor',
                edit_title: 'Edit doctor #{0}',

                tabs: {
                    common: {
                        title: 'Common'
                    },
                    facilities: {
                        title: 'Facilities'
                    }
                }
            }
        }
    },

    fields: {
        item_selector: {
            available: 'Available',
            move_all_left: 'Move all left',
            move_all_right: 'Move all right',
            move_left: 'Move left',
            move_right: 'Move right',
            selected: 'Selected'
        }
    },

    validators: {
        field_required: 'This field is required',
        finish_filling_field: 'Finish filling the field',
        max_length: 'Maximum length — {0}',
        only_letters_allowed: 'Only letters allowed'
    },

    home: {
        greetings_label: 'Welcome to the SFTOOMI application!'
    },

    popup: {
        form_invalid: 'Form is invalid. Please, correct the form and try again',
        more_than_one_selected: 'More than one record selected. Please, select a single record',
        nothing_selected: 'Nothing selected'
    }
};

export default usDictionary;
