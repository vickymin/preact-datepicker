/* @flow */
import { h, Component } from 'preact';

import defaultClassNames from './classNames';
import { SPACE, ENTER } from './keys';

type Props = {
	classNames: ?{
		navBar: string,
		navButtonPrev: string,
		navButtonNext: string,
	},
	className?: string,
	showPreviousButton?: boolean,
	showNextButton?: boolean,
	onPreviousClick?: Function,
	onNextClick?: Function,
	dir?: string,
	labels: {
		previousMonth: string,
		nextMonth: string,
	},
};

class Navbar extends Component<Props> {
	static defaultProps = {
		classNames: defaultClassNames,
		dir: 'ltr',
		labels: {
			previousMonth: 'Previous Month',
			nextMonth: 'Next Month',
		},
		showPreviousButton: true,
		showNextButton: true,
	};

	shouldComponentUpdate(nextProps: Props) {
		return (
			nextProps.labels !== this.props.labels ||
			nextProps.dir !== this.props.dir ||
			this.props.showPreviousButton !== nextProps.showPreviousButton ||
			this.props.showNextButton !== nextProps.showNextButton
		);
	}

	handleNextClick = () => {
		if (this.props.onNextClick) {
			this.props.onNextClick();
		}
	};

	handlePreviousClick = () => {
		if (this.props.onPreviousClick) {
			this.props.onPreviousClick();
		}
	};

	handleNextKeyDown = (event: KeyboardEvent) => {
		if (event.keventCode !== ENTER && event.keyCode !== SPACE) {
			return;
		}
		event.preventDefault();
		this.handleNextClick();
	};

	handlePreviousKeyDown = (event: KeyboardEvent) => {
		if (event.keyCode !== ENTER && event.keyCode !== SPACE) {
			return;
		}
		event.preventDefault();
		this.handlePreviousClick();
	};

	render() {
		const {
			classNames,
			className,
			showPreviousButton,
			showNextButton,
			labels,
			dir,
		} = this.props;

		const previousClickHandler =
			dir === 'rtl' ? this.handleNextClick : this.handlePreviousClick;
		const nextClickHandler =
			dir === 'rtl' ? this.handlePreviousClick : this.handleNextClick;
		const previousKeyDownHandler =
			dir === 'rtl' ? this.handleNextKeyDown : this.handlePreviousKeyDown;
		const nextKeyDownHandler =
			dir === 'rtl' ? this.handlePreviousKeyDown : this.handleNextKeyDown;
		const shouldShowPrevious =
			dir === 'rtl' ? showNextButton : showPreviousButton;
		const shouldShowNext = dir === 'rtl' ? showPreviousButton : showNextButton;

		const previousClassName = shouldShowPrevious
			? classNames.navButtonPrev
			: `${classNames.navButtonPrev} ${
					classNames.navButtonInteractionDisabled
				}`;

		const nextClassName = shouldShowNext
			? classNames.navButtonNext
			: `${classNames.navButtonNext} ${
					classNames.navButtonInteractionDisabled
				}`;

		const previousButton = (
			<span
				tabIndex="0"
				role="button"
				aria-label={labels.previousMonth}
				key="previous"
				class={previousClassName}
				onKeyDown={shouldShowPrevious ? previousKeyDownHandler : undefined}
				onClick={shouldShowPrevious ? previousClickHandler : undefined}
			/>
		);

		const nextButton = (
			<span
				tabIndex="0"
				role="button"
				aria-label={labels.nextMonth}
				key="right"
				class={nextClassName}
				onKeyDown={shouldShowNext ? nextKeyDownHandler : undefined}
				onClick={shouldShowNext ? nextClickHandler : undefined}
			/>
		);

		return (
			<div class={className || classNames.navBar}>
				{dir === 'rtl'
					? [nextButton, previousButton]
					: [previousButton, nextButton]}
			</div>
		);
	}
}

export default Navbar;
