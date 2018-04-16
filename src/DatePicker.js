/* @flow */
import { h, Component } from 'preact';

import * as Helpers from './Helpers';
import * as DateUtils from './DateUtils';
import * as LocaleUtils from './LocaleUtils';
import * as ModifiersUtils from './ModifiersUtils';
import classNames from './classNames';

import { ENTER, SPACE, LEFT, UP, DOWN, RIGHT } from './keys';

import Caption from './Caption';
import Navbar from './Navbar';
import Month from './Month';
import Weekday from './Weekday';

import './styles/datepicker.css';

type Props = {
	/** The month with which the datepicker is rendered */
	initialMonth: Date,
	month?: Date,
	numberOfMonths: number,
	fromMonth?: Date,
	toMonth?: Date,
	canChangeMonth: boolean,
	reverseMonths: boolean,
	pagedNavigation: boolean,
	todayButton?: string,
	showWeekNumbers: boolean,
	selectedDays?: Object | Function | Array<Date>,
	disabledDays?: Object | Function | Array<Date>,
	modifiers?: Object,
	modifiersStyles?: Object,
	dir?: string,
	firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6,
	labels: {
		nextMonth: string,
		previousMonth: string,
	},
	locale: string,
	localeUtils: {
		formatMonthTitle: Function,
		formatWeekdayShort: Function,
		formatWeekdayLong: Function,
		getFirstDayOfWeek: Function,
	},
	months?: Array<string>,
	weekdaysLong?: Array<string>,
	weekdaysShort?: Array<string>,
	enableOutsideDays: boolean,
	fixedWeeks: boolean,
	classNames: {
		body?: string,
		container?: string,
		day: string,
		disabled: string,
		footer?: string,
		interactionDisabled?: string,
		month?: string,
		navBar?: string,
		outside: string,
		selected: string,
		today: string,
		todayButton?: string,
		week?: string,
		wrapper?: string,
	},
	className?: string,
	containerProps?: Object,
	tabIndex: number,
	renderDay: Function,
	renderWeek: Function,
	WeekdayElement: *,
	NavbarElement: *,
	CaptionElement: *,
	onBlur?: Function,
	onFocus?: Function,
	onKeyDown?: Function,
	onDayClick?: Function,
	onDayKeyDown?: Function,
	onDayMouseEnter?: Function,
	onDayMouseLeave?: Function,
	onDayMouseDown?: Function,
	onDayMouseUp?: Function,
	onDayTouchStart?: Function,
	onDayTouchEnd?: Function,
	onDayFocus?: Function,
	onMonthChange?: Function,
	onCaptionClick?: Function,
	onWeekClick?: Function,
	onTodayButtonClick?: Function,
};

type State = {
	month: Date,
	currentMonth: Date,
};

class DatePicker extends Component<Props, State> {
	static defaultProps = {
		classNames,
		tabIndex: 0,
		initialMonth: new Date(),
		numberOfMonths: 1,
		labels: {
			previousMonth: 'Previous Month',
			nextMonth: 'Next Month',
		},
		locale: 'en',
		localeUtils: LocaleUtils,
		enableOutsideDays: false,
		fixedWeeks: false,
		canChangeMonth: true,
		reverseMonths: false,
		pagedNavigation: false,
		showWeekNumbers: false,
		renderDay: day => day.getDate(),
		renderWeek: weekNumber => weekNumber,
		WeekdayElement: Weekday,
		NavbarElement: Navbar,
		CaptionElement: Caption,
	};

	constructor(props: Props) {
		super(props);
		this.state = this.getStateFromProps(props);
	}

	componentWillReceiveProps(nextProps: Props): void {
		if (this.props.month !== nextProps.month) {
			this.setState(this.getStateFromProps(nextProps));
		}
	}

	getStateFromProps = (props: Props): State => {
		const initialMonth = Helpers.startOfMonth(
			props.month || props.initialMonth
		);
		let currentMonth = initialMonth;

		if (props.pagedNavigation && props.numberOfMonths > 1 && props.fromMonth) {
			const diffInMonths = Helpers.getMonthsDiff(props.fromMonth, currentMonth);
			currentMonth = DateUtils.addMonths(
				props.fromMonth,
				Math.floor(diffInMonths / props.numberOfMonths) * props.numberOfMonths
			);
		} else if (props.toMonth && props.numberOfMonths > 1) {
			const diffInMonths = Helpers.getMonthsDiff(props.toMonth, currentMonth);
			if (diffInMonths <= 0) {
				currentMonth = DateUtils.addMonths(
					props.toMonth,
					1 - this.props.numberOfMonths
				);
			}
		}
		return { currentMonth };
	};

	getNextNavigableMonth(): Date {
		return DateUtils.addMonths(
			this.state.currentMonth,
			this.props.numberOfMonths
		);
	}

	getPreviousNavigableMonth(): Date {
		return DateUtils.addMonths(this.state.currentMonth, -1);
	}

	dayPicker = null;

	allowPreviousMonth(): boolean {
		const previousMonth: Date = DateUtils.addMonths(
			this.state.currentMonth,
			-1
		);
		return this.allowMonth(previousMonth);
	}

	allowNextMonth(): boolean {
		const nextMonth: Date = DateUtils.addMonths(
			this.state.currentMonth,
			this.props.numberOfMonths
		);
		return this.allowMonth(nextMonth);
	}

	allowMonth(date: Date): boolean {
		const { fromMonth, toMonth, canChangeMonth } = this.props;
		if (
			!canChangeMonth ||
			(fromMonth && Helpers.getMonthsDiff(fromMonth, date) < 0) ||
			(toMonth && Helpers.getMonthsDiff(toMonth, date) > 0)
		) {
			return false;
		}
		return true;
	}

	allowYearChange(): boolean {
		return this.props.canChangeMonth;
	}

	showMonth(date: Date, callback?: Function): void {
		if (!this.allowMonth(date)) {
			return;
		}
		this.setState({ currentMonth: Helpers.startOfMonth(date) }, () => {
			if (callback) {
				callback();
			}
			if (this.props.onMonthChange) {
				this.props.onMonthChange(this.state.currentMonth);
			}
		});
	}

	showNextMonth = (callback?: Function): void => {
		if (!this.allowNextMonth()) {
			return;
		}
		const deltaMonths = this.props.pagedNavigation
			? this.props.numberOfMonths
			: 1;
		const nextMonth = DateUtils.addMonths(this.state.currentMonth, deltaMonths);
		this.showMonth(nextMonth, callback);
	};

	showPreviousMonth = (callback?: Function): void => {
		if (!this.allowPreviousMonth()) {
			return;
		}
		const deltaMonths = this.props.pagedNavigation
			? this.props.numberOfMonths
			: 1;
		const previousMonth = DateUtils.addMonths(
			this.state.currentMonth,
			-deltaMonths
		);
		this.showMonth(previousMonth, callback);
	};

	showNextYear(): void {
		if (!this.allowYearChange()) {
			return;
		}
		const nextMonth = DateUtils.addMonths(this.state.currentMonth, 12);
		this.showMonth(nextMonth);
	}

	showPreviousYear(): void {
		if (!this.allowYearChange()) {
			return;
		}
		const nextMonth = DateUtils.addMonths(this.state.currentMonth, -12);
		this.showMonth(nextMonth);
	}

	focusFirstDayOfMonth(): void {
		Helpers.getDayNodes(this.dayPicker, this.props.classNames)[0].focus();
	}

	focusLastDayOfMonth(): void {
		const dayNodes = Helpers.getDayNodes(this.dayPicker, this.props.classNames);
		dayNodes[dayNodes.length - 1].focus();
	}

	focusPreviousDay(dayNode: Node): void {
		const dayNodes = Helpers.getDayNodes(this.dayPicker, this.props.classNames);
		const dayNodeIndex = Helpers.nodeListToArray(dayNodes).indexOf(dayNode);

		if (dayNodeIndex === 0) {
			this.showPreviousMonth(() => this.focusLastDayOfMonth());
		} else {
			dayNodes[dayNodeIndex - 1].focus();
		}
	}

	focusNextDay(dayNode: Node): void {
		const dayNodes = Helpers.getDayNodes(this.dayPicker, this.props.classNames);
		const dayNodeIndex = Helpers.nodeListToArray(dayNodes).indexOf(dayNode);

		if (dayNodeIndex === dayNodes.length - 1) {
			this.showNextMonth(() => this.focusFirstDayOfMonth());
		} else {
			dayNodes[dayNodeIndex + 1].focus();
		}
	}

	focusNextWeek(dayNode: Node): void {
		const dayNodes = Helpers.getDayNodes(this.dayPicker, this.props.classNames);
		const dayNodeIndex = Helpers.nodeListToArray(dayNodes).indexOf(dayNode);
		const isInLastWeekOfMonth = dayNodeIndex > dayNodes.length - 8;

		if (isInLastWeekOfMonth) {
			this.showNextMonth(() => {
				const daysAfterIndex = dayNodes.length - dayNodeIndex;
				const nextMonthDayNodeIndex = 7 - daysAfterIndex;
				Helpers.getDayNodes(this.dayPicker, this.props.classNames)[
					nextMonthDayNodeIndex
				].focus();
			});
		} else {
			dayNodes[dayNodeIndex + 7].focus();
		}
	}

	focusPreviousWeek(dayNode: Node): void {
		const dayNodes = Helpers.getDayNodes(this.dayPicker, this.props.classNames);
		const dayNodeIndex = Helpers.nodeListToArray(dayNodes).indexOf(dayNode);
		const isInFirstWeekOfMonth = dayNodeIndex <= 6;

		if (isInFirstWeekOfMonth) {
			this.showPreviousMonth(() => {
				const previousMonthDayNodes = Helpers.getDayNodes(
					this.dayPicker,
					this.props.classNames
				);
				const startOfLastWeekOfMonth = previousMonthDayNodes.length - 7;
				const previousMonthDayNodeIndex = startOfLastWeekOfMonth + dayNodeIndex;
				previousMonthDayNodes[previousMonthDayNodeIndex].focus();
			});
		} else {
			dayNodes[dayNodeIndex - 7].focus();
		}
	}

	// Event handlers

	handleKeyDown = e => {

		switch (e.keyCode) {
			case LEFT:
				this.showPreviousMonth();
				break;
			case RIGHT:
				this.showNextMonth();
				break;
			case UP:
				this.showPreviousYear();
				break;
			case DOWN:
				this.showNextYear();
				break;
			default:
				break;
		}

		if (this.props.onKeyDown) {
			this.props.onKeyDown(e);
		}
	};

	handleDayKeyDown = (day, modifiers, e) => {
		switch (e.keyCode) {
			case LEFT:
				Helpers.cancelEvent(e);
				this.focusPreviousDay(e.target);
				break;
			case RIGHT:
				Helpers.cancelEvent(e);
				this.focusNextDay(e.target);
				break;
			case UP:
				Helpers.cancelEvent(e);
				this.focusPreviousWeek(e.target);
				break;
			case DOWN:
				Helpers.cancelEvent(e);
				this.focusNextWeek(e.target);
				break;
			case ENTER:
			case SPACE:
				Helpers.cancelEvent(e);
				if (this.props.onDayClick) {
					this.handleDayClick(day, modifiers, e);
				}
				break;
			default:
				break;
		}
		if (this.props.onDayKeyDown) {
			this.props.onDayKeyDown(day, modifiers, e);
		}
	};

	handleDayClick = (day, modifiers, e) => {
		if (modifiers[this.props.classNames.outside]) {
			this.handleOutsideDayClick(day);
		}
		if (this.props.onDayClick) {
			this.props.onDayClick(day, modifiers, e);
		}
	};

	handleOutsideDayClick(day) {
		const { currentMonth } = this.state;
		const { numberOfMonths } = this.props;
		const diffInMonths = Helpers.getMonthsDiff(currentMonth, day);
		if (diffInMonths > 0 && diffInMonths >= numberOfMonths) {
			this.showNextMonth();
		} else if (diffInMonths < 0) {
			this.showPreviousMonth();
		}
	}

	handleTodayButtonClick = e => {
		const today = new Date();
		const month = new Date(today.getFullYear(), today.getMonth());
		this.showMonth(month);
		e.target.blur();
		if (this.props.onTodayButtonClick) {
			this.props.onTodayButtonClick(
				new Date(today.getFullYear(), today.getMonth(), today.getDate()),
				ModifiersUtils.getModifiersForDay(today, this.props.modifiers),
				e
			);
		}
	};

	renderNavbar() {
		const {
			labels,
			locale,
			localeUtils,
			canChangeMonth,
			NavbarElement,
			...attributes
		} = this.props;

		if (!canChangeMonth) return null;

		const props = {
			month: this.state.month,
			classNames: this.props.classNames,
			className: this.props.classNames.navBar,
			nextMonth: this.getNextNavigableMonth(),
			previousMonth: this.getPreviousNavigableMonth(),
			showPreviousButton: this.allowPreviousMonth(),
			showNextButton: this.allowNextMonth(),
			onNextClick: this.showNextMonth,
			onPreviousClick: this.showPreviousMonth,
			dir: attributes.dir,
			labels,
			locale,
			localeUtils,
		};

		return <NavbarElement {...props} />;
	}

	renderMonths() {
		const months = [];
		const firstDayOfWeek = Helpers.getFirstDayOfWeekFromProps(this.props);

		for (let i = 0; i < this.props.numberOfMonths; i += 1) {
			const month = DateUtils.addMonths(this.state.currentMonth, i);

			months.push(
				<Month
					key={i}
					{...this.props}
					month={month}
					footer={this.props.todayButton && this.renderTodayButton()}
					firstDayOfWeek={firstDayOfWeek}
					onDayKeyDown={this.handleDayKeyDown}
					onDayClick={this.handleDayClick}
				/>
			);
		}

		if (this.props.reverseMonths) {
			months.reverse();
		}
		return months;
	}

	renderTodayButton() {
		return (
			<button
				type="button"
				tabIndex={0}
				class={this.props.classNames.todayButton}
				aria-label={this.props.todayButton}
				onClick={this.handleTodayButtonClick}
			>
				{this.props.todayButton}
			</button>
		);
	}

	render() {
		let className = this.props.classNames.container;

		if (!this.props.onDayClick) {
			className = `${className} ${this.props.classNames.interactionDisabled}`;
		}
		if (this.props.className) {
			className = `${className} ${this.props.className}`;
		}
		return (
			<div
				{...this.props.containerProps}
				class={className}
				ref={el => (this.dayPicker = el)}
				lang={this.props.locale}
			>
				<div
					class={this.props.classNames.wrapper}
					tabIndex={
						this.props.canChangeMonth && this.props.tabIndex
							? this.props.tabIndex
							: -1
					}
					onKeyDown={this.handleKeyDown}
					onFocus={this.props.onFocus}
					onBlur={this.props.onBlur}
				>
					{this.renderNavbar()}
					{this.renderMonths()}
				</div>
			</div>
		);
	}
}
export default DatePicker;
