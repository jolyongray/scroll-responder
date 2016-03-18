(function() {
  /**
   * Given a list of elements, fires the given callback with the proportion scrolled across
   * @param {Node Array/Nodelist} elements
   * @param {Function} animate Callback fires with a value from 0-1 based on window scroll.
   *                           Does not fire if element not visible
   *                           use e.g. GSAP or element.style.transform = 'translate3d(0,0,0) translateX(' + animationTime + '%)'
   *
   * @param {Object} options
   * @param {Function} options.preCalculate Cache any values on elements before scroll event.
   * @param {Number} options.upperbound Starts animation at this number of px down the viewport. Default: viewport height (animation starts as element becomes visible at bottom of screen).
   * @param {Boolean} options.hideAtScrollTop Makes animation start lower if object will be visible at scroll 0. Overrides options.upperbound if effective.
   */
  var ScrollResponder = function(elements, animate, options) {
    this.elements = elements;
    this.animate = animate;
    this.options = options || {};
    this.options.preCalculate;
    this.options.hideAtScrollTop;
    this.options.upperBound;

    this.latestKnownScrollY = 0;
    this.ticking = false;
    this.viewportHeight;

    if(!elements.length) return;

    this.init();
  }

  /**
   * One time setup, binds events
   * @return {null} Returns if no elements
   */
  ScrollResponder.prototype.init = function() {

    // Assign events
    window.addEventListener('load', this.calculate.bind(this), false);
    window.addEventListener('resize', this.calculate.bind(this), false);
    window.addEventListener('scroll', function() {
      this.latestKnownScrollY = window.pageYOffset;
      requestTick.call(this);
    }.bind(this));

    function requestTick() {
      if(!this.ticking) {
        requestAnimationFrame(this.update.bind(this));
      }
      this.ticking = true;
    }
  }

  /**
   * Recalculate positional values
   */
  ScrollResponder.prototype.calculate = function() {
    // Cache computed values
    this.viewportHeight = window.innerHeight;

    for (var i = 0; i < this.elements.length; i++) {
      element = this.elements[i];
      element.cachedClientHeight = element.clientHeight;
      element.cachedOffsetTotal = ScrollResponder.getOffsetTop(element);
      element.cachedOffsetFromBottom = element.cachedOffsetTotal + element.clientHeight;

      // Any custom caching function given to object
      if(typeof this.preCalculate === "function") this.preCalculate(element);
    };
  }

  /**
   * Update on scroll
   */
  ScrollResponder.prototype.update = function() {
    var currentScrollY = this.latestKnownScrollY;

    for (var i = 0; i < this.elements.length; i++) {
      element = this.elements[i];
      var currentY = window.pageYOffset;
      var upperBound = typeof this.options.upperBound === 'undefined' ? this.viewportHeight : this.options.upperBound;

      if(this.options.hideAtScrollTop) {
        var elementTopFromViewportBottom = this.viewportHeight - element.cachedOffsetTotal;
        if(elementTopFromViewportBottom > 0) {
          upperBound = upperBound - (this.viewportHeight - element.cachedOffsetTotal);
        }
      }

      if(currentY + upperBound > element.cachedOffsetTotal && currentY < element.cachedOffsetFromBottom) {
        var proportionAcross = (currentY + upperBound - element.cachedOffsetTotal) / (element.cachedOffsetFromBottom - element.cachedOffsetTotal + upperBound);

        // Callback
        this.animate(element, proportionAcross);
      }
    };

    this.ticking = false;
  }

  ScrollResponder.getOffsetTop = function(element) {
    var offsetTop = 0;
    while(element) {
        offsetTop += (element.offsetTop);
        element = element.offsetParent;
    }
    return offsetTop;
  }

  window.ScrollResponder = ScrollResponder;
})();
