import { Component, input, InputSignal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router'
import { NgTemplateOutlet } from '@angular/common'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzHeaderComponent } from 'ng-zorro-antd/layout'
import { NzMenuDirective, NzMenuItemComponent } from 'ng-zorro-antd/menu'
import { NzIconDirective } from 'ng-zorro-antd/icon'
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip'
import { NzDropdownDirective, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown'

import Sftoomi from '../../../class/Sftoomi'

import { RoutesPaths, RoutesPermissions } from '../../../app.routes'

import LanguageSwitcherComponent from '../../misc/language-switcher/language-switcher.component'

@Component({
    selector: 'app-navigation-panel',
    templateUrl: './app-navigation-panel.component.html',
    imports: [
        LanguageSwitcherComponent, NgTemplateOutlet, NzButtonComponent,
        NzDropdownDirective, NzDropdownMenuComponent, NzHeaderComponent,
        NzIconDirective, NzMenuDirective, NzMenuItemComponent,
        RouterLink, NzTooltipDirective
    ],
    styleUrl: './app-navigation-panel.component.less'
})

export default class AppNavigationPanelComponent
{
    public readonly isLoading: InputSignal<WritableSignal<boolean> | undefined> = input.required();

    protected readonly RoutesPaths = RoutesPaths;
    protected readonly Sftoomi = Sftoomi;
    protected readonly RoutesPermissions = RoutesPermissions

    constructor(private readonly router: Router)
    {
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
            this.isLoading(),
            (): void => {
                this.router.navigateByUrl(RoutesPaths.LOGIN).then();
            }
        );
    }

    protected getSetupMenuPermissions(): (string | undefined)[]
    {
        return [
            this.RoutesPermissions.get(RoutesPaths.REFERRING_FACILITIES),
            this.RoutesPermissions.get(RoutesPaths.REFERRING_DOCTORS),
            this.RoutesPermissions.get(RoutesPaths.STUDIES)
        ];
    }

    protected getAdministrationMenuPermissions(): (string | undefined)[]
    {
        return [
            this.RoutesPermissions.get(RoutesPaths.USERS),
            this.RoutesPermissions.get(RoutesPaths.GROUPS)
        ];
    }
}
