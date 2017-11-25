/* @flow */
import { h, Component } from 'preact';

type Props = {
	weekday: number,
	className?: string,
	locale?: string,
	localeUtils: Object,

	weekdaysLong?: Array<string>,
	weekdaysShort?: Array<string>,
};

class Weekday extends Component<Props> {
	shouldComponentUpdate(nextProps: Props) {
		return this.props !== nextProps;
	}

	render() {
		const {
			weekday,
			className,
			weekdaysLong,
			weekdaysShort,
			localeUtils,
			locale,
		} = this.props;
		const title: string = weekdaysLong
			? weekdaysLong[weekday]
			: localeUtils.formatWeekdayLong(weekday, locale);
		const content: string = weekdaysShort
			? weekdaysShort[weekday]
			: localeUtils.formatWeekdayShort(weekday, locale);

		return (
			<div class={className} role="columnheader">
				<abbr title={title}>{content}</abbr>
			</div>
		);
	}
}

export default Weekday;
