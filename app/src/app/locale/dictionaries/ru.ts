let ruDictionary: object =  {
    add: 'Добавить',
    clear: 'Очистить',
    dob: 'ДР',
    dob_full: 'Дата рождения',
    doctor: 'Доктор',
    edit: 'Редактировать',
    error: 'Ошибка',
    exam_id: 'ID исследования',
    examinations: 'Обследования',
    facility: 'Учреждение',
    filters: 'Фильтры',
    first_name: 'Имя',
    full_name: 'Полное имя',
    id: 'ID',
    information: 'Информация',
    last_name: 'Фамилия',
    middle_name: 'Отчество',
    no_data_to_display: 'Нет данных для отображения',
    on_offline_message: 'В данный момент вы не в сети, пожалуйста, установите Интернет соединение',
    patient: 'Пациент',
    phone: 'Телефон',
    refresh: 'Обновить',
    remove: 'Удалить',
    save: 'Сохранить',
    search: 'Поиск',
    select_all: 'Выбрать всё',
    short_name: 'Короткое имя',
    staff: 'Персонал',
    studies: 'Исследования',
    study: 'Исследование',
    switch_language: 'Изменить язык',
    switch_theme: 'Поменять тему',
    warning: 'Внимание',

    navigation: {
        doctors: 'Доктора',
        facilities: 'Учреждения',
        home: 'Домашняя',
        patients: 'Пациенты',
        processing: 'Процессинг',
        setup: 'Настройка',
        studies: 'Исследования'
    },

    base_table: {
        items_per_page: 'строк на странице',
        rows: 'строки'
    },

    views: {
        patients: {
            table: {
                columns: {
                    dob: {
                        width: '130px'
                    }
                }
            },
            dialog: {
                add_title: 'Добавление пациента',
                edit_title: 'Редактирование пациента #{0}'
            }
        },
        processing: {
            add_examination: 'Добавить обследование',
            filters: {
                examination_id: 'ID обследования'
            }
        },
        facilities: {
            table: {
                columns: {
                    doctors: 'Доктора'
                }
            },
            dialog: {
                add_title: 'Добавление учреждения',
                edit_title: 'Редактирование учреждения #{0}'
            }
        },
        doctors: {
            table: {
                columns: {
                    facilities: 'Учреждения'
                }
            },
            dialog: {
                add_title: 'Добавление доктора',
                edit_title: 'Редактирование доктора #{0}',

                tabs: {
                    common: {
                        title: 'Общее'
                    },
                    facilities: {
                        title: 'Учреждения'
                    }
                }
            }
        },
        studies: {
            table: {
                columns: {
                    study_cpts: 'CPT коды'
                }
            },
            dialog: {
                add_title: 'Добавление исследования',
                cpts: 'CPT коды',
                edit_title: 'Редактирование исследования #{0}'
            }
        }
    },

    fields: {
        item_selector: {
            available: 'Возможное',
            move_all_left: 'Переместить всё влево',
            move_all_right: 'Переместить всё вправо',
            move_left: 'Переместить влево',
            move_right: 'Переместить вправо',
            selected: 'Выбранное'
        },
        remote_select: {
            tip: 'Наберите минимальное количество символов: {0}'
        }
    },

    validators: {
        field_required: 'Это поле обязательно',
        finish_filling_field: 'Закончите заполнение поля',
        max_length: 'Максимальная длина — {0}',
        only_letters_allowed: 'Разрешены только буквы'
    },

    home: {
        greetings_label: 'Добро пожаловать в SFTOOMI!'
    },

    popup: {
        form_invalid: 'Форма заполнена неверно. Пожалуйста, исправьте форму и попробуйте снова',
        more_than_one_selected: 'Больше, чем одна запись выбрана. Пожалуйста, выберите одну запись',
        nothing_selected: 'Ничего не выбрано'
    }
};

export default ruDictionary;
