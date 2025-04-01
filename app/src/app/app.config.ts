import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { TUI_LANGUAGE } from '@taiga-ui/i18n';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { TUI_DIALOG_OPTIONS, TUI_FIRST_DAY_OF_WEEK, tuiDateFormatProvider } from '@taiga-ui/core';
import { tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { of } from 'rxjs';

import { routes } from './app.routes';

import Sftoomi from './class/Sftoomi';

import getTuiLocalDateFormat from './locale/getTuiLocalDateFormat';
import getLocalFirstDayOfWeek from './locale/getLocalFirstDayOfWeek';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes, withHashLocation()),
        provideAnimations(),
        NG_EVENT_PLUGINS,
        tuiValidationErrorsProvider({
            required: Sftoomi.Translator.translate('validators.field_required'),
            maxlength: ({requiredLength}: {requiredLength: string}): string => Sftoomi.format(Sftoomi.Translator.translate('validators.max_length'), [requiredLength]),
            only_letters: (): string => Sftoomi.Translator.translate('validators.only_letters_allowed')
        }), {
            provide: TUI_LANGUAGE,
            useValue: of(Sftoomi.Translator.getI18nLocale())
        },
        tuiDateFormatProvider(getTuiLocalDateFormat()),
        {
            provide: TUI_FIRST_DAY_OF_WEEK,
            useValue: getLocalFirstDayOfWeek()
        },
        {
            provide: TUI_DIALOG_OPTIONS,
            useValue: {
                dismissible: false,
                size: 'auto'
            }
        },
    ]
};
