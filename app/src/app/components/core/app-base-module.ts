import { Directive, inject, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import Sftoomi from '../../class/Sftoomi'
import { RoutesPaths } from '../../app.routes'
import { DialogType } from '../../class/Dialog'

@Directive()
export default abstract class AppBaseModule implements OnInit
{
    protected readonly Sftoomi = Sftoomi

    protected router: Router = inject(Router);
    protected activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    protected permission: string | null = null;

    public ngOnInit(): void
    {
        if (!this.Sftoomi.Auth.permissions.isAllowed(this.permission)) {
            setTimeout((): void => {
                this.router.navigateByUrl(RoutesPaths.HOME).then((): void => {
                    this.Sftoomi.Dialog.show(
                        'You don\'t have permissions to do this', // TODO: translate
                        DialogType.ERROR
                    );
                })
            });

            return;
        }
    }
}
