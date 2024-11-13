# `<fs-scrollable />`

This Web Component lets you transform HTML container into horizontally scrollable elements. That’s especially convenient for touch menus. By default it shows clickable arrow buttons, which can be used as an alternative to swiping. See below for customization options.

## Usage
- Run `$ npm run build` to create a build.
- Include that JavaScript file in your frontend.
- Use this Web Component by wrapping your desired HTML code like this:
	```html
	<fs-scrollable>
		<div class="make-me-scrollable">My very long horizontal element, which should be scrollable.</div>
	</fs-scrollable>
	```
- Make sure, that the `.make-me-scrollable` element extends to its full width and causes no line wraps.

## Customization
- `<fs-scrollable />` will show clickable buttons and gradients by default.
- `<fs-scrollable hide-buttons />` will only show gradients.
- `<fs-scrollable hide-gradients />` will not show gradients nor buttons.
- In your theme you can use these CSS custom properties for further adjustments:
	- `--fs-scrollable--background-color` defaults to `white`
	- `--fs-scrollable--color-text` defaults to `black`
	- `--fs-scrollable--gradient-width` defaults to `20px`
	- `--fs-scrollable--transition-speed` defaults to `0.1s`
  - `--fs-scrollable--image-size` defaults to `24px`
