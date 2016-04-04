# Scroll Responder
Given a list of elements, fires a callback with the proportion scrolled across each.

## Usage
Put some elements (Array or Nodelist) in and add a callback to run. For example:

```javascript
var elements = document.querySelectorAll('.element');

var scrollAnimation = new ScrollResponder(elements,
  // Animate callback
  function(element, animationTime) {
    if(animationTime > 0.5) return; // Stop animation halfway along
    element.style.transform = 'translate3d(0,0,0) translateY(-' + (animationTime * 100) + '%)';  // Transform an element for parallax effect
    element.timeline.progress(animationTime / 0.5); // Progress a GSAP timeline
  },
  // Options
  {}
);
```

## Options
`preCalculate: function(element)`
Use to precompute and store any values on each element that you will need in your animation function.


`upperbound: number=window.innerHeight`
Starts animation at this number of px down the viewport. Default: viewport height (animation starts as element becomes visible at bottom of screen).


`hideAtScrollTop: boolean=false`
Makes animation start lower if object will be visible at scroll 0. Overrides options.upperbound if effective.
