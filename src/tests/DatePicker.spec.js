import { h } from 'preact';
import { deep } from 'preact-render-spy';

import DatePicker from '../DatePicker';

test('The Datepicker component should do at least something', () => {
	const context = deep(<DatePicker />);

	expect(context).toBeTruthy();
});
