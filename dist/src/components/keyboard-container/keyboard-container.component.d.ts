import { AnimationEvent } from '@angular/animations/src/animation_event';
import { ComponentRef, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { BasePortalHost, ComponentPortal, PortalHostDirective, TemplatePortal } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MdKeyboardConfig } from '../../configs/keyboard.config';
export declare type KeyboardState = 'initial' | 'visible' | 'complete' | 'void';
export declare const SHOW_ANIMATION = "225ms cubic-bezier(0.4,0.0,1,1)";
export declare const HIDE_ANIMATION = "195ms cubic-bezier(0.0,0.0,0.2,1)";
/**
 * Internal component that wraps user-provided keyboard content.
 * @docs-private
 */
export declare class MdKeyboardContainerComponent extends BasePortalHost implements OnDestroy {
    private _ngZone;
    private el;
    private document;
    attrRole: string;
    darkTheme: boolean;
    draggable: boolean;
    private _layoutName;
    private _fixedPositionLeft;
    private _fixedPositionTop;
    private _deltaPositionLeft;
    private _deltaPositionTop;
    readonly currentPositionTop: string;
    readonly currentPositionLeft: string;
    layoutName: string;
    /** The portal host inside of this container into which the keyboard content will be loaded. */
    _portalHost: PortalHostDirective;
    /** Subject for notifying that the keyboard has exited from view. */
    private onExit;
    /** Subject for notifying that the keyboard has finished entering the view. */
    private onEnter;
    /** The state of the keyboard animations. */
    animationState: KeyboardState;
    /** The keyboard configuration. */
    keyboardConfig: MdKeyboardConfig;
    constructor(_ngZone: NgZone, el: ElementRef, document: Document);
    /** Attach a component portal as content to this keyboard container. */
    attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T>;
    /** Attach a template portal as content to this keyboard container. */
    attachTemplatePortal(portal: TemplatePortal): Map<string, any>;
    /** Handle end of animations, updating the state of the keyboard. */
    onAnimationEnd(event: AnimationEvent): void;
    /** Begin animation of keyboard entrance into view. */
    enter(): void;
    /** Returns an observable resolving when the enter animation completes.  */
    _onEnter(): Observable<void>;
    /** Begin animation of the keyboard exiting from view. */
    exit(): Observable<void>;
    /** Returns an observable that completes after the closing animation is done. */
    _onExit(): Observable<void>;
    /**
     * Makes sure the exit callbacks have been invoked when the element is destroyed.
     */
    ngOnDestroy(): void;
    /**
     * Waits for the zone to settle before removing the element. Helps prevent
     * errors where we end up removing an element which is in the middle of an animation.
     */
    private _completeExit();
    private _dragKeyboard($event);
    private _fixPosition();
    private _onMousedown(ev);
}
