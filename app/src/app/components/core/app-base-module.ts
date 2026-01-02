import { Directive, inject } from '@angular/core'

import Sftoomi from '../../class/Sftoomi'
import { ActivatedRoute, Router } from '@angular/router'

@Directive()
export default abstract class AppBaseModule
{
    protected readonly Sftoomi = Sftoomi

    protected router: Router = inject(Router);
    protected activatedRoute: ActivatedRoute = inject(ActivatedRoute);
}
