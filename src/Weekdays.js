/* @flow */
import { h, Component } from 'preact';

type Props = {
	classNames: {
		weekday: string,
		weekdays: string,
		weekdaysRow: string,
	},
	firstDayOfWeek: number,
	weekdaysLong?: Array<string>,
	weekdaysShort?: Array<string>,
	showWeekNumbers?: boolean,
	locale: string,
	localeUtils: Object,
	WeekdayElement?: *,
};

class Weekdays extends Component<Props> {
	shouldComponentUpdate(nextProps) {
		return this.props !== nextProps;
	}

	render() {
		const {
			classNames,
			firstDayOfWeek,
			showWeekNumbers,
			weekdaysLong,
			weekdaysShort,
			locale,
			localeUtils,
			WeekdayElement,
		} = this.props;

		return (
			<div class={classNames.weekdays} role="rowgroup">
				<div class={classNames.weekdaysRow} role="row">
					{showWeekNumbers && <div class={classNames.weekday} />}
					{Array.from(Array(7)).map((value, index) => (
						<WeekdayElement
							key={`weekday-${index}`}
							className={classNames.weekday}
							weekday={(index + firstDayOfWeek) % 7}
							weekdaysLong={weekdaysLong}
							weekdaysShort={weekdaysShort}
							localeUtils={localeUtils}
							locale={locale}
						/>
					))}
				</div>
			</div>
		);
	}
}

export default Weekdays;
