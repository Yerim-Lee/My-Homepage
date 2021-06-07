
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.ScrollTrigger = factory();
	}
}(this, function () {

	'use strict';

	return function(defaultOptions, bindTo, scrollIn) {

		var Trigger = function(_defaultOptions, _element) {
			this.element = _element;
			this.defaultOptions = _defaultOptions;
			this.showCallback = null;
			this.hideCallback = null;
			this.visibleClass = 'visible';
			this.hiddenClass = 'invisible';
			this.addWidth = false;
			this.addHeight = false;
			this.once = false;

			var xOffset = 0;
			var yOffset = 0;

			this.left = function(_this){
				return function(){
					return _this.element.getBoundingClientRect().left;
				};
			}(this);

			this.top = function(_this){
				return function(){
					return _this.element.getBoundingClientRect().top;
				};
			}(this);

			this.xOffset = function(_this){
				return function(goingLeft){
					var offset = xOffset;

					if (_this.addWidth && !goingLeft) {
						offset += _this.width();
					} else if (goingLeft && !_this.addWidth) {
						offset -= _this.width();
					}

					return offset;
				};
			}(this);

			this.yOffset = function(_this){
				return function(goingUp){
					var offset = yOffset;

					if (_this.addHeight && !goingUp) {
						offset += _this.height();
					} else if (goingUp && !_this.addHeight) {
						offset -= _this.height();
					}

					return offset;
				};
			}(this);

			this.width = function(_this) {
				return function(){
					return _this.element.offsetWidth;
				};
			}(this);

			this.height = function(_this) {
				return function(){
					return _this.element.offsetHeight;
				};
			}(this);

			this.reset = function(_this) {
				return function() {
					_this.removeClass(_this.visibleClass);
					_this.removeClass(_this.hiddenClass);
				};
			}(this);

			this.addClass = function(_this){
				var addClass = function(className, didAddCallback) {
					if (!_this.element.classList.contains(className)) {
						_this.element.classList.add(className);
						if ( typeof didAddCallback === 'function' ) {
							didAddCallback();
						}
					}
				};

				var retroAddClass = function(className, didAddCallback) {
					className = className.trim();
					var regEx = new RegExp('(?:^|\\s)' + className + '(?:(\\s\\w)|$)', 'ig');
					var oldClassName = _this.element.className;
					if ( !regEx.test(oldClassName) ) {
						_this.element.className += " " + className;
						if ( typeof didAddCallback === 'function' ) {
							didAddCallback();
						}
					}
				};

				return _this.element.classList ? addClass : retroAddClass;
			}(this);

			this.removeClass = function(_this){
				var removeClass = function(className, didRemoveCallback) {
					if (_this.element.classList.contains(className)) {
						_this.element.classList.remove(className);
						if ( typeof didRemoveCallback === 'function' ) {
							didRemoveCallback();
						}
					}
				};

				var retroRemoveClass = function(className, didRemoveCallback) {
					className = className.trim();
					var regEx = new RegExp('(?:^|\\s)' + className + '(?:(\\s\\w)|$)', 'ig');
					var oldClassName = _this.element.className;
					if ( regEx.test(oldClassName) ) {
						_this.element.className = oldClassName.replace(regEx, "$1").trim();
						if ( typeof didRemoveCallback === 'function' ) {
							didRemoveCallback();
						}
					}
				};

				return _this.element.classList ? removeClass : retroRemoveClass;
			}(this);

			this.init = function(_this){
				return function(){

					var options = _this.defaultOptions;

					var optionString = _this.element.getAttribute('data-scroll');

					if (options) {
						if (options.toggle && options.toggle.visible) {
							_this.visibleClass = options.toggle.visible;
						}

						if (options.toggle && options.toggle.hidden) {
							_this.hiddenClass = options.toggle.hidden;
						}

						if (options.centerHorizontal === true) {
							xOffset = _this.element.offsetWidth / 2;
						}

						if (options.centerVertical === true) {
							yOffset = _this.element.offsetHeight / 2;
						}

						if (options.offset && options.offset.x) {
							xOffset+= options.offset.x;
						}

						if (options.offset && options.offset.y) {
							yOffset+= options.offset.y;
						}

						if (options.addWidth) {
							_this.addWidth = options.addWidth;
						}

						if (options.addHeight) {
							_this.addHeight = options.addHeight;
						}

						if (options.once) {
							_this.once = options.once;
						}
					}


					var parsedAddWidth = optionString.indexOf("addWidth") > -1;
					var parsedAddHeight = optionString.indexOf("addHeight") > -1;
					var parsedOnce = optionString.indexOf("once") > -1;


					if (_this.addWidth === false && parsedAddWidth === true) {
						_this.addWidth = parsedAddWidth;
					}

					if (_this.addHeight === false && parsedAddHeight === true) {
						_this.addHeight = parsedAddHeight;
					}

					if (_this.once === false && parsedOnce === true) {
						_this.once = parsedOnce;
					}


					_this.showCallback = _this.element.getAttribute('data-scroll-showCallback');
					_this.hideCallback = _this.element.getAttribute('data-scroll-hideCallback');


					var classParts = optionString.split('toggle(');
					if (classParts.length > 1) {
						var classes = classParts[1].split(')')[0].split(',');

						if (!String.prototype.trim) {
							String.prototype.trim = function () {
								return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
							};
						}

						_this.visibleClass = classes[0].trim().replace('.', '');
						_this.hiddenClass = classes[1].trim().replace('.', '');
					}

					if (optionString.indexOf("centerHorizontal") > -1) {
						xOffset = _this.element.offsetWidth / 2;
					}

					if (optionString.indexOf("centerVertical") > -1) {
						yOffset = _this.element.offsetHeight / 2;
					}

					var offsetParts = optionString.split('offset(');

					if (offsetParts.length > 1) {
						var offsets = offsetParts[1].split(')')[0].split(',');

						xOffset += parseInt(offsets[0].replace('px', ''));
						yOffset += parseInt(offsets[1].replace('px', ''));
					}

					return _this;
				};
			}(this);
		};

		this.scrollElement = window;

		this.bindElement = document.body;

		var triggers = [];

		var attached = [];

		var previousScroll = {
			left: -1,
			top: -1
		};

		var loop = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function(callback){ setTimeout(callback, 1000 / 60); };

		var isLooping = false;


		var init = function(_this) {
			return function(defaultOptions, bindTo, scrollIn) {

				if (bindTo != undefined && bindTo != null) {
					_this.bindElement = bindTo;
				} else {
					_this.bindElement = document.body;
				}

				if (scrollIn != undefined && scrollIn != null) {
					_this.scrollElement = scrollIn;
				} else {
					_this.scrollElement = window;
				}

				_this.bind(_this.bindElement.querySelectorAll("[data-scroll]"));

				return _this;
			};
		}(this);

		this.bind = function(_this) {
			return function(elements) {
				if (elements instanceof HTMLElement) {
					elements = [elements];
				}

				var newTriggers = [].slice.call(elements);

				newTriggers = newTriggers.map(function (element, index) {
					var trigger = new Trigger(defaultOptions, element);

					return trigger.init();
				});


				triggers = triggers.concat(newTriggers);

				if (triggers.length > 0 && isLooping == false) {
					isLooping = true;


					update();
				} else {
					isLooping = false;
				}


				return _this;
			};
		}(this);


		this.triggerFor = function(_this) {
			return function(htmlElement){
				var returnTrigger = null;

				triggers.forEach(function(trigger, index) {
					if (trigger.element == htmlElement) {
						returnTrigger = trigger;
					}
				});

				return returnTrigger;
			};
		}(this);


		this.destroy = function(_this) {
			return function(htmlElement) {
				triggers.forEach(function(trigger, index) {
					if (trigger.element == htmlElement) {
						triggers.splice(index, 1);
					}
				});


				return _this;
			};
		}(this);


		this.destroyAll = function(_this) {
			return function() {
				triggers = [];

				return _this;
			};
		}(this);

	
		this.reset = function(_this) {
			return function(htmlElement) {
				var trigger = _this.triggerFor(htmlElement);

				if (trigger != null) {
					trigger.reset();

					var index = triggers.indexOf(trigger);

					if (index > -1) {
						triggers.splice(index, 1);
					}
				}


				return _this;
			};
		}(this);


		this.resetAll = function(_this) {
			return function() {
				triggers.forEach(function(trigger, index) {
					trigger.reset();
				});

				triggers = [];

				return _this;
			};
		}(this);

		this.attach = function(_this) {
			return function(callback) {

				attached.push(callback);

				if (!isLooping) {
					isLooping = true;

					update();
				}

				return _this;
			};
		}(this);


		this.detach = function(_this) {
			return function(callback) {

				var index = attached.indexOf(callback);

				if (index > -1) {
					attached.splice(index, 1);
				}

				return _this;
			};
		}(this);

		var _this = this;



		function update() {
			var windowWidth = _this.scrollElement.innerWidth;
			var windowHeight = _this.scrollElement.innerHeight;


			var currentTop = !_this.bindElement.scrollTop ? document.documentElement.scrollTop : _this.bindElement.scrollTop;
			var currentLeft = !_this.bindElement.scrollLeft ? document.documentElement.scrollLeft : _this.bindElement.scrollLeft;


			if (previousScroll.left != currentLeft || previousScroll.top != currentTop) {

				triggers.forEach(function(trigger, index){
					var triggerLeft = trigger.left();
					var triggerTop = trigger.top();

					if (previousScroll.left > currentLeft) {

						triggerLeft -= trigger.xOffset(true);
					} else if (previousScroll.left < currentLeft) {

						triggerLeft += trigger.xOffset(false);
					}

					if (previousScroll.top > currentTop) {

						triggerTop -= trigger.yOffset(true);
					} else if (previousScroll.top < currentTop){

						triggerTop += trigger.yOffset(false);
					}

	
					if (triggerLeft < windowWidth && triggerLeft >= 0 &&
						triggerTop < windowHeight && triggerTop >= 0) {

						trigger.addClass(trigger.visibleClass, function(){
							if (trigger.showCallback) {
								functionCall(trigger, trigger.showCallback);
							}
						});

						trigger.removeClass(trigger.hiddenClass);

						if (trigger.once) {

							triggers.splice(index, 1);
						}
					} else {

						trigger.addClass(trigger.hiddenClass);
						trigger.removeClass(trigger.visibleClass, function(){
							if (trigger.hideCallback) {
								functionCall(trigger, trigger.hideCallback);
							}
						});
					}
				});


				attached.forEach(function(callback) {
					callback.call(_this, currentLeft, currentTop, windowWidth, windowHeight);
				});


				previousScroll.left = currentLeft;
				previousScroll.top = currentTop;
			}

			if (triggers.length > 0 || attached.length > 0) {
				isLooping = true;


				loop(update);
			} else {
				isLooping = false;
			}
		}

		function functionCall(trigger, functionAsString) {
			var params = functionAsString.split('(');
			var method = params[0];

			if (params.length > 1) {
				params = params[1].split(')')[0]; 
			} else {
				params = undefined;
			}

			if (window[method]) {

				window[method].call(trigger.element, params);
			}
		}

		return init(defaultOptions, bindTo, scrollIn);
	};
}));
