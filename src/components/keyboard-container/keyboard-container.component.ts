import {animate, state, style, transition, trigger} from '@angular/animations';
import {AnimationEvent} from '@angular/animations/src/animation_event';
import {first} from '@angular/cdk';
import {Component, ComponentRef, ElementRef, HostBinding, HostListener, Inject, Input, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {BasePortalHost, ComponentPortal, PortalHostDirective, TemplatePortal} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {throwContentAlreadyAttached} from '../../utils/keyboard-errors';
import {MdKeyboardConfig} from '../../configs/keyboard.config';
import {DOCUMENT} from '@angular/common';

export type KeyboardState = 'initial' | 'visible' | 'complete' | 'void';

// TODO(jelbourn): we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
export const SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
export const HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';

/**
 * Internal component that wraps user-provided keyboard content.
 * @docs-private
 */
@Component({
	selector: 'md-keyboard-container',
	templateUrl: './keyboard-container.component.html',
	styleUrls: ['./keyboard-container.component.scss'],
	animations: [
		trigger('state', [
			state('initial', style({top: '100%'})),
			state('visible', style({top: '50%'})),
			state('complete', style({top: '100%'})),
			transition('visible => complete', animate(HIDE_ANIMATION)),
			transition('initial => visible, void => visible', animate(SHOW_ANIMATION)),
		])
	],
})
export class MdKeyboardContainerComponent extends BasePortalHost implements OnDestroy {
	@HostBinding('attr.role') attrRole = 'alert';

	@HostBinding('class.dark-theme')
	@Input() darkTheme: boolean;

	@Input() draggable: boolean;

	private _layoutName: string;

	private _fixedPositionLeft;
	private _fixedPositionTop;

	private _deltaPositionLeft;
	private _deltaPositionTop;

	@HostBinding('style.top')
	get currentPositionTop(): string {
		return this._deltaPositionTop + 'px';
	}

	@HostBinding('style.left')
	get currentPositionLeft(): string {
		return this._deltaPositionLeft + 'px';
	}

	@HostBinding('attr.data-layout-name') get layoutName() {
		return this._layoutName;
	}

	set layoutName(layoutName: string) {
		this._layoutName = layoutName;
	}

	/** The portal host inside of this container into which the keyboard content will be loaded. */
	@ViewChild(PortalHostDirective) _portalHost: PortalHostDirective;

	/** Subject for notifying that the keyboard has exited from view. */
	private onExit: Subject<any> = new Subject();

	/** Subject for notifying that the keyboard has finished entering the view. */
	private onEnter: Subject<any> = new Subject();

	/** The state of the keyboard animations. */
	@HostBinding('@state')
	animationState: KeyboardState = 'initial';

	/** The keyboard configuration. */
	keyboardConfig: MdKeyboardConfig;

	constructor(
		private _ngZone: NgZone,
		private el: ElementRef,
		@Inject(DOCUMENT) private document: Document,
	) {
		super();
	}

	/** Attach a component portal as content to this keyboard container. */
	attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
		if (this._portalHost.hasAttached()) {
			throwContentAlreadyAttached();
		}

		return this._portalHost.attachComponentPortal(portal);
	}

	/** Attach a template portal as content to this keyboard container. */
	attachTemplatePortal(portal: TemplatePortal): Map<string, any> {
		throw Error('Not yet implemented');
	}

	/** Handle end of animations, updating the state of the keyboard. */
	@HostListener('@state.done', ['$event'])
	onAnimationEnd(event: AnimationEvent) {
		if (event.toState === 'void' || event.toState === 'complete') {
			this._completeExit();
		}

		if (event.toState === 'visible') {
			// Note: we shouldn't use `this` inside the zone callback,
			// because it can cause a memory leak.
			const onEnter = this.onEnter;

			this._ngZone.run(() => {
				onEnter.next();
				onEnter.complete();
			});
		}
	}

	/** Begin animation of keyboard entrance into view. */
	enter(): void {
		this.animationState = 'visible';
	}

	/** Returns an observable resolving when the enter animation completes.  */
	_onEnter(): Observable<void> {
		this.animationState = 'visible';
		return this.onEnter.asObservable();
	}

	/** Begin animation of the keyboard exiting from view. */
	exit(): Observable<void> {
		this.animationState = 'complete';
		return this._onExit();
	}

	/** Returns an observable that completes after the closing animation is done. */
	_onExit(): Observable<void> {
		return this.onExit.asObservable();
	}

	/**
	 * Makes sure the exit callbacks have been invoked when the element is destroyed.
	 */
	ngOnDestroy() {
		this._completeExit();
	}

	/**
	 * Waits for the zone to settle before removing the element. Helps prevent
	 * errors where we end up removing an element which is in the middle of an animation.
	 */
	private _completeExit() {
		// Note: we shouldn't use `this` inside the zone callback,
		// because it can cause a memory leak.
		const onExit = this.onExit;

		first.call(this._ngZone.onMicrotaskEmpty).subscribe(() => {
			onExit.next();
			onExit.complete();
		});
	}

	private _dragKeyboard($event) {
		// -- Выставляем начальные значения на основе текущих данных
		const rects = this.el.nativeElement.getBoundingClientRect();

		if (undefined === this._deltaPositionLeft) {
			this._deltaPositionLeft = this._fixedPositionLeft = rects.left;
		}

		if (undefined === this._deltaPositionTop) {
			this._deltaPositionTop = this._fixedPositionTop = rects.top;
		}
		// -- -- -- --

		// -- Определяем границы, за которые нельзя двигать клавиатуру
		const bounds = {
			top:    40,
			right:  this.el.nativeElement.parentElement.parentElement.offsetWidth - this.el.nativeElement.offsetWidth - 40,
			bottom: this.el.nativeElement.parentElement.parentElement.offsetHeight - this.el.nativeElement.offsetHeight,
			left:   0
		};
		// -- -- -- --

		let newLeftDelta = this._fixedPositionLeft + $event.deltaX;
		let newTopDelta  = this._fixedPositionTop + $event.deltaY;

		if (newLeftDelta > bounds.right) {
			newLeftDelta = bounds.right;
		}
		else if (newLeftDelta < bounds.left) {
			newLeftDelta = bounds.left;
		}

		if (newTopDelta > bounds.bottom) {
			newTopDelta = bounds.bottom;
		}
		else if (newTopDelta < bounds.top) {
			newTopDelta = bounds.top;
		}

		this._deltaPositionLeft = newLeftDelta;
		this._deltaPositionTop  = newTopDelta;
	}

	private _fixPosition() {
		this._fixedPositionLeft = this._deltaPositionLeft;
		this._fixedPositionTop = this._deltaPositionTop;
	}

	private _onMousedown(ev: MouseEvent) {
		ev.preventDefault();
	}
}
