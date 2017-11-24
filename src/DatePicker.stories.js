/* @flow */
/* eslint-disable no-console */
import { h } from 'preact';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';

import DatePicker from './DatePicker';

const stories = storiesOf('DatePicker', module);

stories.addDecorator(withKnobs);

stories.add(
	'Default',
	withInfo(`The _default_ datepicker.`)(() => <DatePicker />)
);
