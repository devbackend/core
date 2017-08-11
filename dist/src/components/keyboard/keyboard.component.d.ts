import { ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IKeyboardLayout } from '../../configs/keyboard-layouts.config';
import { KeyboardModifier } from '../../enums/keyboard-modifier.enum';
import { MdKeyboardRef } from '../../utils/keyboard-ref.class';
import { MdKeyboardService } from '../../services/keyboard.service';
/**
 * A component used to open as the default keyboard, matching material spec.
 * This should only be used internally by the keyboard service.
 */
export declare class MdKeyboardComponent implements OnInit {
    private _locale;
    private _keyboardService;
    cssClass: boolean;
    darkTheme: boolean;
    hasAction: boolean;
    isDebug: boolean;
    switches: string[];
    locale?: string;
    layout: IKeyboardLayout;
    modifier: KeyboardModifier;
    keyboardRef: MdKeyboardRef<MdKeyboardComponent>;
    private _inputInstance$;
    private _switchValue;
    readonly inputInstance: Observable<ElementRef>;
    setInputInstance(inputInstance: ElementRef): void;
    constructor(_locale: any, _keyboardService: MdKeyboardService);
    ngOnInit(): void;
    dismiss(): void;
    isActive(key: string): boolean;
    onAltClick(): void;
    onCapsClick(): void;
    onShiftClick(): void;
    onEnterClick(): void;
    onSwitchClick(): void;
}
