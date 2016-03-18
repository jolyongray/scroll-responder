(function() {
  /**
   * Given a list of elements, fires the given callback with the proportion scrolled across
   * @param {Node Array/Nodelist} elements
   * @param {Function} animate Callback fires with a value from 0-1 based on window scroll.
   *                           Does not fire if element not visible
   *                           use e.g. GSAP or element.style.transform = 'translate3d(0,0,0) translateX(' + animationTime + '%)'
   *
   * @param {Function} cacheElementAttribute Any values to cache on an element before scroll event
   */
  var ScrollResponder = function(elements, animate, cacheElementAttributes, options) {
    this.elements = elements;
    this.animate = animate;
    this.cacheElementAttributes = cacheElementAttributes;
    this.options = options || {};
    this.options.upperBound = options.upperBound === false ? false : options.upperBound;

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

      // Any custom caching given to object
      if(typeof this.cacheElementAttributes === "function") this.cacheElementAttributes(element);
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
      var upperBound = this.options.upperBound === false ? this.viewportHeight : this.options.upperBound;
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
