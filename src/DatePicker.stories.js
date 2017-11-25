/* @flow */
/* eslint-disable no-console */
import { h } from 'preact';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';

import DatePicker from './DatePicker';

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
