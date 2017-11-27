/* @flow */
/* eslint-disable no-console */
import { h, Component } from 'preact';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';

import DatePicker from './DatePicker';
import DateUtils from './DateUtils';

const stories = storiesOf('DatePicker', module);

stories.addDecorator(withKnobs);

stories.add(
	'Default',
	withInfo(`The _default_ datepicker.`)(() => <DatePicker />)
);

stories.add(
	'Outside Days',
	withInfo(`The datepicker with outside days displayed.`)(() => (
		<DatePicker enableOutsideDays={boolean('enableOutsideDays', true)} />
	))
);

stories.add(
	'Week Numbers',
	withInfo(`The datepicker with week numbers.`)(() => (
		<DatePicker
			showWeekNumbers={boolean('showWeekNumbers', true)}
			onWeekClick={(week, days) => console.log(week, days)}
		/>
	))
);

stories.add(
	'Fixed Weeks',
	withInfo(
		`The datepicker with 6 displayed weeks for every year of the month.`
	)(() => <DatePicker fixedWeeks={boolean('fixedWeeks', true)} />)
);

stories.add(
	'Today Button',
	withInfo(`The datepicker with a custom go to today button.`)(() => (
		<DatePicker
			month={new Date(new Date().setMonth(new Date().getMonth() - 1))}
			todayButton={text('todayButton', 'Today')}
			modifiers={{
				today: new Date(),
			}}
			onTodayButtonClick={(day, modifiers) => console.log(day, modifiers)}
		/>
	))
);

stories.add(
	'Custom Initial Month',
	withInfo(`The datepicker with a custom initial month.`)(() => (
		<DatePicker month={new Date(2017, 0)} />
	))
);

stories.add(
	'Prevent Month Navigation',
	withInfo(`A datepicker displaying only a single specific month.`)(() => (
		<DatePicker canChangeMonth={boolean('canChangeMonth', false)} />
	))
);

stories.add(
	'Restrict Month Navigation',
	withInfo(`A datepicker displaying only displaying a specific set of months.`)(
		() => (
			<DatePicker
				month={new Date(2018, 8)}
				fromMonth={new Date(2018, 8)}
				toMonth={new Date(2018, 11)}
				fixedWeeks
			/>
		)
	)
);

stories.add(
	'Multiple Months',
	withInfo(`A datepicker displaying multiple months.`)(() => (
		<DatePicker
			numberOfMonths={number('numberOfMonths', 2)}
			fixedWeeks={boolean('fixedWeeks', false)}
			pagedNavigation={boolean('pagedNavigation', false)}
			reverseMonths={boolean('reverseMonths', false)}
		/>
	))
);

stories.add(
	'Selected Days',
	withInfo(`A datepicker displaying a set of selected days.`)(() => (
		<DatePicker
			initialMonth={new Date(2018, 0)}
			selectedDays={[
				new Date(2018, 0, 3),
				new Date(2018, 0, 1),
				{
					after: new Date(2018, 0, 15),
					before: new Date(2018, 0, 22),
				},
			]}
		/>
	))
);

class SelectDayDatePicker extends Component<{}, { selectedDay: ?Date }> {
	state = {
		selectedDay: undefined,
	};

	handleDayClick = (day, { selected }) => {
		this.setState({
			selectedDay: selected ? undefined : day,
		});
	};

	render() {
		return (
			<div>
				<DatePicker
					selectedDays={this.state.selectedDay}
					onDayClick={this.handleDayClick}
				/>
				<p>
					{this.state.selectedDay
						? this.state.selectedDay.toLocaleDateString()
						: 'Please select a day 👻'}
				</p>
			</div>
		);
	}
}

stories.add(
	'Interactive Selected Days',
	withInfo(`A datepicker where a click on a day marks it as selected.`)(() => (
		<SelectDayDatePicker />
	))
);

class SelectMultipleDatePicker extends Component<
	{},
	{ selectedDays: Array<any> }
> {
	state = {
		selectedDays: [],
	};

	handleDayClick = (day, { selected }) => {
		const { selectedDays } = this.state;
		if (selected) {
			const selectedIndex = selectedDays.findIndex(selectedDay =>
				DateUtils.isSameDay(selectedDay, day)
			);
			selectedDays.splice(selectedIndex, 1);
		} else {
			selectedDays.push(day);
		}
		this.setState({ selectedDays });
	};

	render() {
		return (
			<DatePicker
				selectedDays={this.state.selectedDays}
				onDayClick={this.handleDayClick}
			/>
		);
	}
}

stories.add(
	'Interactive Multiple Selected Days',
	withInfo(`A datepicker where a click on a day marks it as selected.`)(() => (
		<SelectMultipleDatePicker />
	))
);
