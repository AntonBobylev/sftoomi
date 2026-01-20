import { Component, signal, WritableSignal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzI18nService } from 'ng-zorro-antd/i18n';

import Sftoomi from './class/Sftoomi';

import { RoutesPaths } from './app.routes';

import ResponsiveLayoutService from './services/responsive-layout.service';
import PopupMsgService from './services/popup-msg.service'

import AppLoadingSpinnerComponent from './components/misc/app-loading-spinner/app-loading-spinner.component';
import AppNavigationPanelComponent from './components/layout/app-navigation-panel/app-navigation-panel.component'

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet, NzLayoutModule, NzMenuModule,
        NzModalModule, AppLoadingSpinnerComponent, AppNavigationPanelComponent
    ],
    templateUrl: './app.html',
    styleUrl: './app.less'
})

export class App
{
    protected readonly Sftoomi = Sftoomi;

    protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(false);

    constructor(
        readonly nzDialog: NzModalService,
        readonly nzI18nService: NzI18nService,
        readonly responsiveLayoutService: ResponsiveLayoutService,
        readonly popupMsgService: PopupMsgService,
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
}
