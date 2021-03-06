import {InjectionToken} from '@angular/core';

interface IKeyboardIcons {
	[key: string]: string;
}

const MD_KEYBOARD_ICONS = new InjectionToken<IKeyboardIcons>('keyboard-icons.config');
const keyboardIcons: IKeyboardIcons = {
	'bksp':     'keyboard_backspace',
	'caps':     'keyboard_capslock',
	'enter':    'keyboard_return',
	'space':    '',
	'shift':    'keyboard_arrow_up',
	'tab':      'keyboard_tab',
	'switch':   'language'
};

export {IKeyboardIcons, MD_KEYBOARD_ICONS, keyboardIcons};
