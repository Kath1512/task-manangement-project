import { Directive, ElementRef, EventEmitter, HostListener, inject, Output } from '@angular/core';

@Directive({
    selector: '[appClickOutsideDirective]',
})
export class ClickOutsideDirective {
    @Output('appClickOutsideDirective') clickOutsideEvent = new EventEmitter<void>();
    private el = inject(ElementRef);


    @HostListener('document:click', ['$event.target']) onClickOutside(target: any){
        if(!this.el.nativeElement.contains(target)){
            this.clickOutsideEvent.emit();
        }
    }
}
