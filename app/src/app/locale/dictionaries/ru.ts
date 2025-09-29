let ruDictionary: object =  {
    add: 'Добавить',
    dob_full: 'Дата рождения',
    edit: 'Редактировать',
    error: 'Ошибка',
    first_name: 'Имя',
    full_name: 'Полное имя',
    id: 'ID',
    information: 'Информация',
    last_name: 'Фамилия',
    middle_name: 'Отчество',
    no_data_to_display: 'Нет данных для отображения',
    not_set: 'Не установлено',
    ok: 'OK',
    phone: 'Телефон',
    refresh: 'Обновить',
    remove: 'Удалить',
    save: 'Сохранить',
    select_all: 'Выбрать всё',
    short_name: 'Сокращенное имя',
    switch_language: 'Изменить язык',
    warning: 'Внимание',

    navigation: {
        home: 'Домашняя',
        patients: 'Пациенты',
        setup: {
            caption: 'Настройка',
            referring_doctors: 'Направляющие доктора',
            referring_facilities: 'Направляющие учреждения',
            studies: 'Обследования'
        }
    },

    views: {
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
        }
    },

    validators: {
        phone_number_is_invalid: 'Неверный номер телефона',
        field_required: 'Это обязательное поле!',
        max_length: 'Максимально разрешенная длина — {0}',
        min_length: 'Минимально разрешенная длина — {0}',
        only_letters_allowed: 'Разрешены только буквы'
    },

    popup: {
        form_invalid: 'Форма заполнена неверно. Пожалуйста, исправьте форму и попробуйте снова',
        more_than_one_selected: 'Больше, чем одна запись выбрана. Пожалуйста, выберите одну запись',
        nothing_selected: 'Ничего не выбрано'
    }
};

export default ruDictionary;
