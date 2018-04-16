/* @flow */
import { h, Component } from 'preact';

import Weekdays from './Weekdays';
import Day from './Day';
import { ENTER } from './keys';

import * as ModifiersUtils from './ModifiersUtils';
import * as Helpers from './Helpers';
import * as DateUtils from './DateUtils';

type Props = {
	classNames: {
		body: string,
		month: string,
		outside: string,
		today: string,
		week: string,
	},
	tabIndex?: number,

	month: Date,
	months?: Array<string>,

	modifiersStyles?: Object,

	enableOutsideDays?: boolean,

	renderDay: Function,
	renderWeek: Function,

	CaptionElement: *,
	WeekdayElement: *,

	footer?: *,
	fixedWeeks?: boolean,
	showWeekNumbers?: boolean,

	locale: string,
	localeUtils: Object,
	weekdaysLong?: Array<string>,
	weekdaysShort?: Array<string>,
	firstDayOfWeek: number,

	onCaptionClick?: Function,
	onDayClick?: Function,
	onDayFocus?: Function,
	onDayKeyDown?: Function,
	onDayMouseEnter?: Function,
	onDayMouseLeave?: Function,
	onDayMouseDown?: Function,
	onDayMouseUp?: Function,
	onDayTouchEnd?: Function,
	onDayTouchStart?: Function,
	onWeekClick?: Function,
};

class Month extends Component<Props> {
	renderDay = (day: Date) => {
		const monthNumber = this.props.month.getMonth();
		const propModifiers = Helpers.getModifiersFromProps(this.props);
		const dayModifiers = ModifiersUtils.getModifiersForDay(day, propModifiers);
		if (
			DateUtils.isSameDay(day, new Date()) &&
			!Object.prototype.hasOwnProperty.call(
				propModifiers,
				this.props.classNames.today
			)
		) {
			dayModifiers.push(this.props.classNames.today);
		}
		if (day.getMonth() !== monthNumber) {
			dayModifiers.push(this.props.classNames.outside);
		}

		const isOutside = day.getMonth() !== monthNumber;
		let tabIndex = -1;
		// Focus on the first day of the month
		if (this.props.onDayClick && !isOutside && day.getDate() === 1) {
			tabIndex = this.props.tabIndex; // eslint-disable-line prefer-destructuring
		}
		const key = `${day.getFullYear()}${day.getMonth()}${day.getDate()}`;
		const modifiers = {};
		dayModifiers.forEach(modifier => {
			modifiers[modifier] = true;
		});

		return (
			<Day
				key={`${isOutside ? 'outside-' : ''}${key}`}
				classNames={this.props.classNames}
				day={day}
				modifiers={modifiers}
				modifiersStyles={this.props.modifiersStyles}
				empty={
					isOutside && !this.props.enableOutsideDays && !this.props.fixedWeeks
				}
				tabIndex={tabIndex}
				ariaLabel={this.props.localeUtils.formatDay(day, this.props.locale)}
				ariaDisabled={isOutside || dayModifiers.indexOf('disabled') > -1}
				ariaSelected={dayModifiers.indexOf('selected') > -1}
				onClick={this.props.onDayClick}
				onFocus={this.props.onDayFocus}
				onKeyDown={this.props.onDayKeyDown}
				onMouseEnter={this.props.onDayMouseEnter}
				onMouseLeave={this.props.onDayMouseLeave}
				onMouseDown={this.props.onDayMouseDown}
				onMouseUp={this.props.onDayMouseUp}
				onTouchEnd={this.props.onDayTouchEnd}
				onTouchStart={this.props.onDayTouchStart}
			>
				{this.props.renderDay(day, modifiers)}
			</Day>
		);
	};

	render() {
		const {
			classNames,

			month,
			months,

			fixedWeeks,
			CaptionElement,
			WeekdayElement,

			locale,
			localeUtils,
			weekdaysLong,
			weekdaysShort,
			firstDayOfWeek,

			onCaptionClick,

			footer,
			showWeekNumbers,
			onWeekClick,
		} = this.props;

		const captionProps = {
			date: month,
			classNames,
			months,
			localeUtils,
			locale,
			onClick: onCaptionClick ? e => onCaptionClick(month, e) : undefined,
		};
		const weeks = Helpers.getWeekArray(month, firstDayOfWeek, fixedWeeks);

		return (
			<div class={classNames.month} role="grid">
				<CaptionElement {...captionProps} />
				<Weekdays
					classNames={classNames}
					weekdaysShort={weekdaysShort}
					weekdaysLong={weekdaysLong}
					firstDayOfWeek={firstDayOfWeek}
					showWeekNumbers={showWeekNumbers}
					locale={locale}
					localeUtils={localeUtils}
					WeekdayElement={WeekdayElement}
				/>
				<div class={classNames.body} role="rowgroup">
					{weeks.map(week => {
						let weekNumber;
						if (showWeekNumbers) {
							weekNumber = DateUtils.getWeekNumber(week[0]);
						}
						return (
							<div key={week[0].getTime()} class={classNames.week} role="row">
								{showWeekNumbers && (
									<div
										class={classNames.weekNumber}
										tabIndex={0}
										role="gridcell"
										{...(onWeekClick
											? {
												onClick: e => onWeekClick(weekNumber, week, e),
												onKeyUp: e =>
													e.keyCode === ENTER &&
													onWeekClick(weekNumber, week, e),
											}
											: {})}
									>
										{this.props.renderWeek(weekNumber, week, month)}
									</div>
								)}
								{week.map(this.renderDay)}
							</div>
						);
					})}
				</div>
				{footer && <div class={classNames.footer}>{footer}</div>}
			</div>
		);
	}
}

export default Month;
