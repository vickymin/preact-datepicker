/* @flow */
import { h } from 'preact';
import render from 'preact-render-to-json';
import initStoryshots from '@storybook/addon-storyshots';

const preactSnapshot = options => ({ story, context }) => {
	const storyElement = story.render(context);
	const tree = render(storyElement, options);

	expect(tree).toMatchSnapshot();
};

initStoryshots({
	framework: 'react',
	test: preactSnapshot(),
});
