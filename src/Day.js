/* @flow */
import { h, Component } from 'preact';
import { isSameDay } from './DateUtils';
import { hasOwnProp } from './Helpers';

import defaultClassNames from './classNames';

function handleEvent(handler, day, modifiers) {
	if (!handler) {
		return undefined;
	}
	return e => {
		handler(day, modifiers, e);
	};
}

type Props = {
	classNames: {
		day: string,
	},

	day: Date,
	children: *,

	ariaDisabled?: boolean,
	ariaLabel?: string,
	ariaSelected?: boolean,
	empty?: boolean,
	modifiers?: Object,
	modifiersStyles?: Object,
	onClick?: Function,
	onKeyDown?: Function,
	onMouseEnter?: Function,
	onMouseLeave?: Function,
	onMouseDown?: Function,
	onMouseUp?: Function,
	onTouchEnd?: Function,
	onTouchStart?: Function,
	onFocus?: Function,
	tabIndex?: number,
};

export default class Day extends Component<Props> {
	static defaultProps = {
		tabIndex: -1,
	};

	static defaultProps = {
		modifiers: {},
		modifiersStyles: {},
		empty: false,
	};

	shouldComponentUpdate(nextProps: Props) {
		const propNames = Object.keys(this.props);
		const nextPropNames = Object.keys(nextProps);
		if (propNames.length !== nextPropNames.length) {
			return true;
		}
		return propNames.some(name => {
			if (
				name === 'modifiers' ||
				name === 'modifiersStyles' ||
				name === 'classNames'
			) {
				const prop = this.props[name];
				const nextProp = nextProps[name];
				const modifiers = Object.keys(prop);
				const nextModifiers = Object.keys(nextProp);
				if (modifiers.length !== nextModifiers.length) {
					return true;
				}
				return modifiers.some(
					mod => !hasOwnProp(nextProp, mod) || prop[mod] !== nextProp[mod]
				);
			}
			if (name === 'day') {
				return !isSameDay(this.props[name], nextProps[name]);
			}
			return (
				!hasOwnProp(nextProps, name) || this.props[name] !== nextProps[name]
			);
		});
	}

	render() {
		const {
			classNames,
			modifiersStyles,
			day,
			tabIndex,
			empty,
			modifiers,
			onMouseEnter,
			onMouseLeave,
			onMouseUp,
			onMouseDown,
			onClick,
			onKeyDown,
			onTouchStart,
			onTouchEnd,
			onFocus,
			ariaLabel,
			ariaDisabled,
			ariaSelected,
			children,
		} = this.props;

		let className = classNames.day;
		if (classNames !== defaultClassNames) {
			// When using CSS modules prefix the modifier as required by the BEM syntax
			className += ` ${Object.keys(modifiers).join(' ')}`;
		} else {
			className += Object.keys(modifiers)
				.map(modifier => ` ${className}--${modifier}`)
				.join('');
		}

		let style;
		if (modifiersStyles) {
			Object.keys(modifiers)
				.filter(modifier => !!modifiersStyles[modifier])
				.forEach(modifier => {
					style = { ...style, ...modifiersStyles[modifier] };
				});
		}

		if (empty) {
			return <div aria-disabled class={className} style={style} />;
		}
		return (
			<div
				class={className}
				tabIndex={tabIndex}
				style={style}
				role="gridcell"
				aria-label={ariaLabel}
				aria-disabled={ariaDisabled}
				aria-selected={ariaSelected}
				onClick={handleEvent(onClick, day, modifiers)}
				onKeyDown={handleEvent(onKeyDown, day, modifiers)}
				onMouseEnter={handleEvent(onMouseEnter, day, modifiers)}
				onMouseLeave={handleEvent(onMouseLeave, day, modifiers)}
				onMouseUp={handleEvent(onMouseUp, day, modifiers)}
				onMouseDown={handleEvent(onMouseDown, day, modifiers)}
				onTouchEnd={handleEvent(onTouchEnd, day, modifiers)}
				onTouchStart={handleEvent(onTouchStart, day, modifiers)}
				onFocus={handleEvent(onFocus, day, modifiers)}
			>
				{children}
			</div>
		);
	}
}
