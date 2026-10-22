import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import ru from '@angular/common/locales/ru';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { en_US, ru_RU, NZ_I18N, NZ_DATE_CONFIG } from 'ng-zorro-antd/i18n';
import { provideNzDateFnsAdapter } from 'ng-zorro-antd/core/time';

import { routes } from './app.routes';

import getFirstDayOfWeek from './locale/getFirstDayOfWeek'

registerLocaleData(en);
registerLocaleData(ru);

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withHashLocation()),
        {
            provide: NZ_I18N,
            useFactory: () => {
                const localId: string = inject(LOCALE_ID);
                switch (localId) {
                    case 'ru':
                        return ru_RU;
                    case 'en':
                    default:
                        return en_US;
                }
            }
        },
        provideNzDateFnsAdapter(),
        provideHttpClient(),
        {
            provide: NZ_DATE_CONFIG,
            useValue: {
                firstDayOfWeek: getFirstDayOfWeek()
            }
        }
    ]
};
