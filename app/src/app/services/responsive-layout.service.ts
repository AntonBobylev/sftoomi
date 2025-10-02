import { computed, inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})

export default class ResponsiveLayoutService
{
    breakpointObserver = inject(BreakpointObserver);

    screenWidth = toSignal(this.breakpointObserver.observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
    ]))

    isSmallWidth = computed((): boolean =>
        this.screenWidth()!.breakpoints[Breakpoints.XSmall] || this.screenWidth()!.breakpoints[Breakpoints.Small]
    );

    isMediumWidth = computed(() =>
        this.screenWidth()!.breakpoints[Breakpoints.Medium]
    );

    isLargeWidth = computed(() =>
        this.screenWidth()!.breakpoints[Breakpoints.Large] || this.screenWidth()!.breakpoints[Breakpoints.XLarge]
    );
}
