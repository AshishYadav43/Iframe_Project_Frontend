import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPatternRestrict]',
  standalone: true
})
export class PatternRestrictDirective {

  @Input('appPatternRestrict') pattern!: string; 
  private lastValidValue = ''; 

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (!this.pattern) return;
    
    const regex = new RegExp(this.pattern);
    
    if (regex.test(input.value)) {
      // ✅ Value matches pattern → update last valid value
      this.lastValidValue = input.value;
    } else {
      //  Value fails → revert to last valid value
      input.value = this.lastValidValue;
      input.dispatchEvent(new Event('input')); 
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Block paste
  }
}
