import type { Preview } from '@storybook/sveltekit';

// Load the design tokens + reset so every story renders with the same
// foundations as the running app.
import '../src/app.css';
import './preview.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			default: 'app',
			values: [
				{ name: 'app', value: '#faf9f6' },
				{ name: 'surface', value: '#ffffff' },
				{ name: 'sunken', value: '#f1efe8' }
			]
		},
		options: {
			storySort: {
				order: [
					'Docs',
					['Introduction', 'Tokens'],
					'Layout',
					'Form',
					'Containers',
					'Lists',
					'Page',
					'Bits'
				]
			}
		}
	},
	tags: ['autodocs']
};

export default preview;
