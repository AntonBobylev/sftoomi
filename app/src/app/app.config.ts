import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TUI_LANGUAGE } from '@taiga-ui/i18n';
import { of } from 'rxjs';

import { routes } from './app.routes';
import Sftoomi from './class/Sftoomi';

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
        }),
        {
            provide: TUI_LANGUAGE,
            useValue: of(Sftoomi.Translator.getI18nLocale()),
        }
    ]
};
