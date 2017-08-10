import { ElementRef } from '@angular/core';
import { MdKeyboardService } from '../services/keyboard.service';
export declare class MdKeyboardDirective {
    private _elementRef;
    private _keyboardService;
    private _keyboardRef;
    mdKeyboard: string;
    darkTheme: boolean;
    duration: number;
    hasAction: boolean;
    isDebug: boolean;
    switches: string[];
    private _showKeyboard();
    /** @todo-10.08.17-krivonos.iv  */
    constructor(_elementRef: ElementRef, _keyboardService: MdKeyboardService);
}
