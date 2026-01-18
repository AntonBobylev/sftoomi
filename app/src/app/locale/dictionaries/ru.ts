let ruDictionary: object =  {
    add: 'Добавить',
    clear: 'Очистить',
    dob_full: 'Дата рождения',
    dob_short: 'ДР',
    edit: 'Редактировать',
    error: 'Ошибка',
    filters: 'Фильтры',
    first_name: 'Имя',
    full_name: 'Полное имя',
    id: 'ID',
    information: 'Информация',
    last_name: 'Фамилия',
    logout: 'Выйти',
    middle_name: 'Отчество',
    no_data_to_display: 'Нет данных для отображения',
    not_set_tip: '(не установлено)',
    ok: 'OK',
    phone: 'Телефон',
    refresh: 'Обновить',
    remove: 'Удалить',
    save: 'Сохранить',
    search: 'Поиск',
    select_all: 'Выбрать всё',
    short_name: 'Сокращенное имя',
    switch_language: 'Изменить язык',
    warning: 'Внимание',

    navigation: {
        examinations: 'Обследования',
        home: 'Домашняя',
        login: 'Вход',
        patients: 'Пациенты',
        administration: {
            caption: 'Администрирование',
            groups: 'Группы',
            users: 'Пользователи'
        },
        setup: {
            caption: 'Настройка',
            referring_doctors: 'Направляющие доктора',
            referring_facilities: 'Направляющие учреждения',
            studies: 'Обследования'
        },
        mobile_view: {
            button_caption: 'МЕНЮ'
        }
    },

    views: {
        login: {
            login: 'Логин',
            logon: 'Войти',
            password: 'Пароль',
            reset_password: 'Восстановить пароль'
        },
        examinations: {
            table: {
                columns: {
                    referring: {
                        caption: 'Направление',
                        doctor: 'Врач',
                        facility: 'Учреждение'
                    },
                    patient: 'Пациент',
                    studies: 'Исследования'
                }
            },
            filters: {
                examination_date: 'Дата обследования',
                examination_id: 'ID обследования'
            },
            dialog: {
                add_title: 'Добавление обследования',
                edit_title: 'Редактирование обследования #{0}',
                no_studies_added_tip: 'Вы должны добавить хотя бы одно исследование, чтобы сохранить обследование',
                blocks: {
                    common: {
                        header: 'Общее',
                        date: 'Дата'
                    },
                    patient: {
                        header: 'Пациент',
                        patient_id: 'ID пациента'
                    },
                    referring: {
                        header: 'Направление',
                        facility: 'Учреждение',
                        doctor: 'Врач'
                    },
                    studies: {
                        header: 'Исследования'
                    }
                }
            }
        },
        patients: {
            dialog: {
                add_title: 'Добавление пациента',
                edit_title: 'Редактирование пациента #{0}'
            },
            phone_column_header_tooltip: 'Сотовый номер пациента'
        },
        home: {
            greetings_label: 'Добро пожаловать в SFTOOMI!'
        },
        referring_facilities: {
            table: {
                columns: {
                    doctors: {
                        caption: 'Врачи',
                        tooltip: 'Врачи, которые привязаны к учреждению'
                    }
                }
            },
            dialog: {
                add_title: 'Добавление направляющего учреждения',
                doctors: 'Врачи',
                edit_title: 'Редактирование направляющего учреждения #{0}',
                width: 500
            }
        },
        referring_doctors: {
            table: {
                columns: {
                    facilities: {
                        caption: 'Учреждения',
                        tooltip: 'Учреждения, в которых состоит врач'
                    }
                }
            },
            dialog: {
                add_title: 'Добавление направляющего врача',
                edit_title: 'Редактирование направляющего врача #{0}',
                facilities: 'Учреждения',
                width: 500
            }
        },
        studies: {
            table: {
                columns: {
                    cpts: {
                        caption: 'CPT',
                        tooltip: 'CPT коды, которые привязаны к текущему обследованию'
                    }
                }
            },
            dialog: {
                add_title: 'Добавление обследования',
                edit_title: 'Редактирование обследования #{0}',
                width: 500,
                cpts: 'CPT'
            }
        },
        groups: {
            table: {
                columns: {
                    name: {
                        caption: 'Имя'
                    },
                    permissions: {
                        caption: 'Права'
                    }
                }
            },
            dialog: {
                add_title: 'Добавить группу',
                edit_title: 'Редактирование группы #{0}',
                width: 400
            }
        },
        users: {
            table: {
                columns: {
                    login: {
                        caption: 'Логин'
                    },
                    created_at: {
                        caption: 'Когда создан'
                    }
                }
            },
            dialog: {
                add_title: 'Добавление пользователя',
                common_panel_title: 'Общее',
                contacts_panel_title: 'Контакты',
                disabled: 'Выключен',
                disabled_tooltip: 'Система заблокирует доступ этому пользователю',
                edit_title: 'Редактирование пользователя #{0}',
                force_to_change_password: 'Обязать сменить пароль',
                force_to_change_password_tooltip: 'Система разлогинит пользователя и в следующий раз, когда он попытается войти, она запросит его сменить пароль',
                groups: 'Группы',
                links_panel_title: 'Связи',
                login: 'Логин',
                reset_password: 'Сбросить пароль',
                reset_password_tooltip: 'Сгенерировать новый пароль и послать его пользователю через e-mail',
            }
        }
    },

    fields: {
        item_selector: {
            available: 'Доступно',
            move_all_left: 'Переместить все влево',
            move_all_right: 'Переместить все вправо',
            move_left: 'Переместить влево',
            move_right: 'Переместить вправо',
            selected: 'Выбрано'
        },
        studies_selector: {
            caption: 'Исследования',
            add_study: 'Добавить исследование',
            combo: {
                placeholder: 'Выберите исследование'
            }
        },
        contacts: {
            add_email_tip: 'Добавьте адрес электронной почты, чтобы пользователь смог получить пароль',
            address: 'Адрес',
            email: 'Email',
            phone: 'Телефон',
            position: 'Позиция',
            text: 'Текст',
            type: 'Тип',
            table: {
                columns: {
                    position_mover: {
                        caption: 'Действия',
                        move_up_tip: 'Двинуть выше',
                        move_down_tip: 'Двинуть ниже'
                    }
                }
            },
            dialog: {
                add_title: 'Добавление контакта',
                edit_title: 'Редактирование контакта'
            }
        }
    },

    dialogs: {
        change_password: {
            change_password_tip: 'Пожалуйста, смените пароль',
            new_password: 'Новый пароль',
            new_password_confirmation: 'Подтверждение пароля',
            old_password: 'Старый пароль',
            title: 'Изменение пароля'
        },
        reset_password: {
            email: 'E-mail',
            login: 'Логин',
            password_reset_message: 'Email письмо было послано на почтовый ящик, который вы указали, если текущая связка логин-почта существует',
            reset_button_caption: 'Восстановить',
            title: 'Восстановление пароля'
        }
    },

    validators: {
        email: 'Неправильный формат электронной почты',
        field_required: 'Это обязательное поле!',
        max_length: 'Максимальная длина — {0}',
        max_value: 'Максимальное значение: {0}',
        min_length: 'Минимальная длина — {0}',
        min_value: 'Минимальное значение: {0}',
        only_letters_allowed: 'Разрешены только буквы',
        phone_number_is_invalid: 'Неверный номер телефона'
    },

    popup: {
        form_invalid: 'Форма заполнена неверно. Пожалуйста, исправьте форму и попробуйте снова',
        more_than_one_selected: 'Больше, чем одна запись выбрана. Пожалуйста, выберите одну запись',
        nothing_selected: 'Ничего не выбрано'
    }
};

export default ruDictionary;
