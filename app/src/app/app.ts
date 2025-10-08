import { Component, signal, WritableSignal } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzDropDownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

import Sftoomi from './class/Sftoomi';

import { RoutesPaths } from './app.routes';

import LanguageSwitcherComponent from './components/misc/language-switcher/language-switcher.component';

import ResponsiveLayoutService from './services/responsive-layout.service';
import PopupMsgService from './services/popup-msg.service'
import AppLoadingSpinnerComponent from './components/misc/app-loading-spinner/app-loading-spinner.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet, NzLayoutModule, NzMenuModule,
        RouterLink, NzModalModule, LanguageSwitcherComponent,
        NzDropDownDirective, NzDropdownMenuComponent,
        NzIconDirective, NgTemplateOutlet,
        NzButtonComponent, NgClass, NzTooltipDirective, AppLoadingSpinnerComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.less'
})

export class App
{
    protected readonly Sftoomi = Sftoomi;
    protected readonly RoutesPaths = RoutesPaths;

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    constructor(
        private readonly nzDialog: NzModalService,
        private readonly nzI18nService: NzI18nService,
        private readonly responsiveLayoutService: ResponsiveLayoutService,
        private readonly popupMsgService: PopupMsgService,
        private readonly router: Router
    )
    {
        this.isLoading.set(true);

        Sftoomi.init(
            nzDialog,
            nzI18nService,
            responsiveLayoutService,
            popupMsgService
        );

        Sftoomi.Auth.tryRestoreSession((): void => {
            let lastUrl: string = this.router.url;

            if (!Sftoomi.Auth.getIsAuthorizedSignal()()) {
                this.router.navigateByUrl(RoutesPaths.LOGIN, {
                    state: {
                        last_route: lastUrl
                    }
                }).then((): void => {
                    this.isLoading.set(false);
                });

                return;
            }

            if (lastUrl.slice(1) === RoutesPaths.LOGIN) {
                lastUrl = RoutesPaths.HOME;
            }

            this.router.navigateByUrl(lastUrl).then((): void => {
                this.isLoading.set(false);
            });
        });
    }

    protected isRouteSelected(route: RoutesPaths): boolean
    {
        let currentRoute: string = this.router.url;
        if (currentRoute === '/') {
            currentRoute = '';
        }

        return route === currentRoute;
    }

    protected onLogoutClick(): void
    {
        Sftoomi.Auth.logout(
            this.isLoading,
            (): void => {
                this.router.navigateByUrl(RoutesPaths.LOGIN).then();
            }
        );
    }
}
