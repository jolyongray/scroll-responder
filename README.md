# Scroll Responder
Given a list of elements, fires a callback with the proportion scrolled across each.

# Usage
```javascript
var elements = document.querySelectorAll('.element');

var scrollAnimation = new ScrollResponder(elements,
  // Animate callback
  function(element, animationTime) {
    if(animationTime > 0.5) return; // Stop animation halfway along
    element.style.transform = 'translate3d(0,0,0) translateX(-' + (animationTime * 100) + '%)';  // Transform an element for parallax effect
    element.timeline.progress(animationTime / 0.5); // Progress a GSAP timeline
  }
);
```
