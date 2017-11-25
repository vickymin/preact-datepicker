import { h } from 'preact';
import { configure, addDecorator } from '@storybook/react';
import { setDefaults } from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';

setOptions({
	name: 'Preact Datepicker',
	url: 'https://preact-datepicker.netlify.com',
	downPanelInRight: true,
});

setDefaults({
	header: false,
	inline: true,
	source: true,
});

const req = require.context('../src', true, /\.stories\.js$/);

function loadStories() {
	req.keys().forEach(filename => req(filename));
}

addDecorator(story => <div>{story()}</div>);

configure(loadStories, module);
