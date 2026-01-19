let usDictionary: object =  {
    add: 'Add',
    clear: 'Clear',
    dob_full: 'Date of birth',
    dob_short: 'DoB',
    edit: 'Edit',
    error: 'Error',
    filters: 'Фильтры',
    first_name: 'First name',
    full_name: 'Full name',
    id: 'ID',
    information: 'Information',
    last_name: 'Last name',
    logout: 'Logout',
    middle_name: 'Middle name',
    no_data_to_display: 'No data to display',
    not_set_tip: '(not set)',
    ok: 'OK',
    phone: 'Phone',
    refresh: 'Refresh',
    remove: 'Remove',
    save: 'Save',
    search: 'Search',
    select_all: 'Select all',
    short_name: 'Short name',
    switch_language: 'Switch language',
    warning: 'Warning',

    navigation: {
        examinations: 'Examinations',
        home: 'Home',
        login: 'Login',
        patients: 'Patients',
        administration: {
            caption: 'Administration',
            groups: 'Groups',
            users: 'Users'
        },
        setup: {
            caption: 'Setup',
            referring_doctors: 'Referring doctors',
            referring_facilities: 'Referring facilities',
            studies: 'Studies'
        },
        mobile_view: {
            button_caption: 'MENU'
        }
    },

    views: {
        login: {
            login: 'Login',
            logon: 'Logon',
            password: 'Password',
            reset_password: 'Reset password'
        },
        examinations: {
            table: {
                columns: {
                    referring: {
                        caption: 'Referring',
                        doctor: 'Doctor',
                        facility: 'Facility'
                    },
                    patient: 'Patient',
                    studies: 'Studies'
                }
            },
            filters: {
                examination_date: 'Examination date',
                examination_id: 'Examination ID'
            },
            dialog: {
                add_title: 'Add examination',
                edit_title: 'Edit examination #{0}',
                no_studies_added_tip: 'You need to add at least one study to save the examination',
                blocks: {
                    common: {
                        header: 'Common',
                        date: 'Date'
                    },
                    patient: {
                        header: 'Patient',
                        patient_id: 'Patient ID'
                    },
                    referring: {
                        header: 'Referring',
                        facility: 'Facility',
                        doctor: 'Doctor'
                    },
                    studies: {
                        header: 'Studies'
                    }
                }
            }
        },
        patients: {
            dialog: {
                add_title: 'Add patient',
                edit_title: 'Edit patient #{0}',
            },
            phone_column_header_tooltip: 'Patient\'s cell phone'
        },
        home: {
            greetings_label: 'Welcome to the SFTOOMI application!'
        },
        referring_facilities: {
            table: {
                columns: {
                    doctors: {
                        caption: 'Doctors',
                        tooltip: 'Doctors assigned to the facility'
                    }
                }
            },
            dialog: {
                add_title: 'Add referring facility',
                doctors: 'Doctors',
                edit_title: 'Edit referring facility #{0}',
                width: '400px'
            }
        },
        referring_doctors: {
            table: {
                columns: {
                    facilities: {
                        caption: 'Facilities',
                        tooltip: 'Facilities to which the doctor is assigned'
                    }
                }
            },
            dialog: {
                add_title: 'Add referring doctor',
                edit_title: 'Edit referring doctor #{0}',
                facilities: 'Facilities',
                width: '400px'
            }
        },
        studies: {
            table: {
                columns: {
                    cpts: {
                        caption: 'CPTs',
                        tooltip: 'CPT codes assigned to the current study'
                    }
                }
            },
            dialog: {
                add_title: 'Add study',
                edit_title: 'Edit study #{0}',
                width: '400px',
                cpts: 'CPTs'
            }
        },
        groups: {
            table: {
                columns: {
                    name: {
                        caption: 'Name'
                    },
                    permissions: {
                        caption: 'Permissions'
                    }
                }
            },
            dialog: {
                add_title: 'Add group',
                edit_title: 'Edit group #{0}',
                width: '600px'
            }
        },
        users: {
            table: {
                columns: {
                    login: {
                        caption: 'Login'
                    },
                    created_at: {
                        caption: 'Created at'
                    },
                    links: {
                        caption: 'Links',
                        groups: 'Groups',
                        and_more: 'and {0} more...'
                    }
                }
            },
            dialog: {
                add_title: 'Add user',
                common_panel_title: 'Common',
                contacts_panel_title: 'Contacts',
                disabled: 'Disabled',
                disabled_tooltip: 'The system will restrict an access to this user',
                edit_title: 'Edit user #{0}',
                force_to_change_password: 'Force to change a password',
                force_to_change_password_tooltip: 'System will logout the user and next time he tries to logon it will require to change the password',
                groups: 'Groups',
                links_panel_title: 'Links',
                login: 'Login',
                reset_password: 'Reset password',
                reset_password_tooltip: 'Generate the new password and send it via email',
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
        },
        studies_selector: {
            caption: 'Studies',
            add_study: 'Add study',
            combo: {
                placeholder: 'Select the study'
            }
        },
        contacts: {
            add_email_tip: 'Add an email address so user will be able to get a password',
            address: 'Address',
            email: 'Email',
            phone: 'Phone',
            position: 'Position',
            text: 'Text',
            type: 'Type',
            table: {
                columns: {
                    position_mover: {
                        caption: 'Actions',
                        move_up_tip: 'Move up',
                        move_down_tip: 'Move down'
                    }
                }
            },
            dialog: {
                add_title: 'Add contact',
                edit_title: 'Edit contact'
            }
        }
    },

    dialogs: {
        change_password: {
            change_password_tip: 'Please change your password',
            new_password: 'New password',
            new_password_confirmation: 'New password confirmation',
            old_password: 'Old password',
            title: 'Change password'
        },
        reset_password: {
            email: 'E-mail',
            login: 'Login',
            password_reset_message: 'The mail was sent to the email address you provided, if the current login-mail combination exists',
            reset_button_caption: 'Reset',
            title: 'Reset password'
        }
    },

    validators: {
        email: 'Wrong email format',
        field_required: 'This field is required',
        max_length: 'Maximum allowed length — {0}',
        max_value: 'Maximum allowed value is {0}',
        min_length: 'Minimum allowed length — {0}',
        min_value: 'Minimum allowed value is {0}',
        only_letters_allowed: 'Only letters allowed',
        phone_number_is_invalid: 'Phone number is invalid'
    },

    popup: {
        form_invalid: 'Form is invalid. Please, correct the form and try again',
        more_than_one_selected: 'More than one record selected. Please, select a single record',
        nothing_selected: 'Nothing selected'
    }
};

export default usDictionary;
