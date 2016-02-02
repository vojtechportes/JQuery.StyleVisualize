;(function($){
  $.fn.styleVisualize = function(config) {
    	function Plugin (config) {
    		var configJSON = {};

    		$.ajax({
    			'async': false,
    			'url': config,
    			'global': false,
    			'dataType': "json",
    			'success': function (data) {
    				configJSON = data;
    			}
    		});

    		this.config = configJSON;
    	}

    	Plugin.prototype.extractStyle = function (el, style) {
    		var styles = {};
    		var text = '';
    		var $el = el;
    		var offset = $el.offset();
    		var outerSize = {'width': $el.outerWidth(), 'height': $el.outerHeight()};
    		var innerSize = {'width': $el.width(), 'height': $el.height()};

    		switch (style) {
    			case 'margin-top':
    				var margin = $el.margin().top;
    				if (margin > 0) {
    					styles = {'top': offset.top - margin, 'left': offset.left, 'width': outerSize.width, 'height': margin, 'line-height': margin + 'px'};
    					text = margin + 'px';
    				}
    				break;

    			case 'margin-bottom':
    				var margin = $el.margin().bottom;
    				if (margin) {
    					styles = {'top': offset.top + outerSize.height, 'left': offset.left, 'width': outerSize.width, 'height': margin, 'line-height': margin + 'px'};
    					text = margin + 'px';
    				}
    				break;

    			case 'margin-left':
    				var margin = $el.margin();
    				if (margin.left > 0) {
    					styles = {'top': offset.top - margin.top, 'left': offset.left - margin.left, 'width': margin.left, 'height': outerSize.height + margin.top + margin.bottom, 'line-height': outerSize.height + margin.top + margin.bottom + 'px'};
    					text = margin.left + 'px';
    				}
    				break;

    			case 'margin-right':
    				var margin = $el.margin();
    				if (margin.right > 0) {
    					styles = {'top': offset.top - margin.top, 'left': offset.left + outerSize.width, 'width': margin.right, 'height': outerSize.height + margin.top + margin.bottom, 'line-height': outerSize.height + margin.top + margin.bottom + 'px'};
    					text = margin.right + 'px';
    				}
    				break;

    			case 'padding-top':
    				var padding = $el.padding();
    				console.log(padding);
    				var border = $el.border();
    				if (padding.top > 0) {
    					styles = {'top': offset.top + border.top, 'left': offset.left + border.left + padding.left, 'width': innerSize.width, 'height': padding.top, 'line-height': padding.top + 'px'};
    					text = padding.top + 'px';
    				}
    				break;

    			case 'padding-bottom':
    				var padding = $el.padding();
    				var margin = $el.margin();
    				var border = $el.border();
    				if (padding.bottom > 0) {
    					if (margin.top > 0) {
    						padding.top = 0;
    					}

    					styles = {'top': offset.top + innerSize.height + padding.right + border.top + border.bottom + padding.top, 'left': offset.left + border.left + padding.left, 'width': innerSize.width, 'height': padding.bottom, 'line-height': padding.bottom + 'px'};
    					text = padding.bottom + 'px';
    				}
    				break;

    			case 'padding-right':
    				var padding = $el.padding();
    				var bottom = $el.padding().top;
    				var border = $el.border();
    				if (padding.right > 0) {
    					styles = {'top': offset.top + border.top, 'left': offset.left + innerSize.width + border.left + padding.left, 'width': padding.right, 'height': outerSize.height - border.bottom, 'line-height': outerSize.height + 'px'};
    					text = padding.right + 'px';
    				}
    				break;

    			case 'padding-left':
    				var padding = $el.padding();
    				var bottom = $el.padding().top;
    				var border = $el.border();
    				if (padding.left > 0) {
    					styles = {'top': offset.top + border.top, 'left': offset.left + border.left, 'width': padding.left, 'height': outerSize.height - border.bottom, 'line-height': outerSize.height + 'px'};
    					text = padding.left + 'px';
    				}
    				break;

    			case 'size':
    				var padding = $el.padding();
    				var border = $el.border();
    				if (innerSize.width > 0 && innerSize.height > 0) {
    					styles = {'top': offset.top + padding.top + border.top, 'left': offset.left + border.left + padding.left, 'width': innerSize.width, 'height': innerSize.height + border.top, 'line-height': innerSize.height + 'px'};
    					text = innerSize.height + 'px / ' + innerSize.width + 'px';
    				}
    				break;
    		}
    		return {'styles': styles, 'text': text};
    	}

    	Plugin.prototype.setElement = function (el) {
    		var _el = $('<div />').appendTo(this.$container);
    		this.setStyle(_el, el);
    	}

    	Plugin.prototype.setStyle = function (el, origEl) {
    		var _this = this;
    		var $el = $(el);
    		var origEl = origEl;

    		$.each(this.config.styles, function (k, property) {
    			var el = $('<div class="sv-element ' + property + '" />').appendTo($el);
    			var data = _this.extractStyle($(origEl), property);
    			
    			$(el).css(data.styles);
    			$(el).text(data.text);
    		});
    	}

    	Plugin.prototype.setContainer = function () {
    		if ($('#sv-container').length === 0) {
    			$('body').append('<div id="sv-container" />');
    		} else {
    			$('#sv-container').empty();
    		}

    		this.$container = $('#sv-container');
    	}

    	Plugin.prototype.setStyles = function () {
    		var _this = this;

    		$.each(this.config.elements, function (k, el) {
    			if ($(el).length === 0) {
    				delete _this.config.elements[k];
    			} else {
	    			if ($(el).css('float') !== 'left' || $(el).css('float') === 'right') {
	    				$(el).after('<div class="sv-clearfix" />');
	    			}
    			}
    		});

    		$.each(this.config.elements, function (k, el){
				if ($(el).length > 1) {
					$.each($(el), function(k, el){
						_this.setElement(el);
					});
				} else {
					_this.setElement(el);	
				}
    		});
    	}

    	Plugin.prototype.initialize = function () {
    		this.setContainer();
    		this.setStyles();
    	}

    	$(document).ready(function(){
    		new Plugin(config).initialize();
    	});
  };
})(jQuery);