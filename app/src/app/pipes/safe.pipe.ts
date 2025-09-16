import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform
{
    constructor(private readonly domSanitizer: DomSanitizer) {}

    transform(value: string | null, context: SecurityContext = SecurityContext.HTML): SafeValue | null
    {
        if (typeof value !== 'string') {
            value = '';
        }

        return this.bypassSecurityTrust(context, value!);
    }

    private bypassSecurityTrust(context: SecurityContext, purifiedValue: string): SafeValue | null
    {
        switch (context) {
            case SecurityContext.HTML:
                return this.domSanitizer.bypassSecurityTrustHtml(purifiedValue);
            case SecurityContext.STYLE:
                return this.domSanitizer.bypassSecurityTrustStyle(purifiedValue);
            case SecurityContext.SCRIPT:
                return this.domSanitizer.bypassSecurityTrustScript(purifiedValue);
            case SecurityContext.URL:
                return this.domSanitizer.bypassSecurityTrustUrl(purifiedValue);
            case SecurityContext.RESOURCE_URL:
                return this.domSanitizer.bypassSecurityTrustResourceUrl(purifiedValue);
            default:
                return null;
        }
    }
}
