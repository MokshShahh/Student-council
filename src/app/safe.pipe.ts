import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string, type: string): SafeResourceUrl | SafeUrl | SafeStyle {
    switch (type) {
      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resource':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
      default:
        throw new Error(`Invalid safe type: ${type}`);
    }
  }
}
