# Minimalist Navigation Bar

## Description

This is a minimalistic navigation bar that is generated using data from a JSON file. The navigation bar has a sliding bar that indicates a selected item, and that bar resizes itself to match the width of the selected item text.

## Specifications

- On resize, the sliding indicator bar updates its position and size to match the text
- Code is optimized for Safari, support for other browsers are included (Chrome & Firefox)
- No library usage, only ES6 and CSS.

## Considerations

My idea going into this navigation cmoponent is to make it accessible for inclusivity. With this in mind, we can use the `aria-selected` attribute for a multitude of features including animations, styles and much more.

By using `aria-selected`, we don't have add/remove classes on buttons, we can use this attribute to determine which button is active and simply update its value when needed. This value is used to determine the active state of a button in the navigation bar and is used for animations. 

Animations are done using `transforms` rather than absolutely positioned elements as the DOM will NOT be re-drawn.

The hover media query allows us to detect the user's primary input mechanism can hover over elements. It can have two values: none detects when the primary input mechanism can't hover or can't conveniently hover, like most cellphones and tablets.

## How to Run

`npm install`

`npm run start`

package.json is configured to run the server on localhost:8080 & the default addresses used by `http-server`

## Notes

- Not optimized for mobile
