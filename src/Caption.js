/* @flow */
import { h, Component } from 'preact';

import LocaleUtils from './LocaleUtils';

import { ENTER } from './keys';

type Props = {
	date: Date,
	months?: Array<string>,
	locale?: string,
	localeUtils: Object,
	onClick: Function,
	classNames: {
		caption: string,
	},
};

class Caption extends Component<Props> {
	static defaultProps = {
		localeUtils: LocaleUtils,
	};

	shouldComponentUpdate(nextProps: Props) {
		return (
			nextProps.locale !== this.props.locale ||
			nextProps.classNames !== this.props.classNames ||
			nextProps.date.getMonth() !== this.props.date.getMonth() ||
			nextProps.date.getFullYear() !== this.props.date.getFullYear()
		);
	}

	handleKeyUp = (event: KeyboardEvent) => {
		if (event.keyCode === ENTER) {
			this.props.onClick(event);
		}
	};

	render() {
		const {
			classNames,
			date,
			months,
			locale,
			localeUtils,
			onClick,
		} = this.props;
		return (
			<div class={classNames.caption} role="heading">
				<div onClick={onClick} onKeyUp={this.handleKeyUp}>
					{months
						? `${months[date.getMonth()]} ${date.getFullYear()}`
						: localeUtils.formatMonthTitle(date, locale)}
				</div>
			</div>
		);
	}
}

export default Caption;
