/**
 * Copyright (c) 2014 Daniel Corn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
;
(function (name, context, factory) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory();
	}
	else if (typeof define === 'function' && define.amd) {
		define(function () {
			return (context[name] = factory());
		});
	}
	else {
		context[name] = factory();
	}
}('CunddError', this, function () {

	'use strict';

	/**
	 * Detects and registers the error handler
	 *
	 * @constructor
	 */
	function CunddError() {
		this.logger = window.console || this;
		this.loggerFunction = window.console ? window.console.error || window.console.log : this._loggerFunction;

		this.useCustomLogger = this.loggerFunction === this._loggerFunction;
		this.loggerContainer = null;
		this.input = null;

		if (this.useCustomLogger) {
			this._addLoggerContainer();
		}

		this.register();
	}

	CunddError.prototype = {
		_loggerFunction: function (message, file, line) {
			var _loggerContainer = this.loggerContainer,
				_logEntry = document.createElement('div');
			_logEntry.innerHTML = message + ' '
				+ '<span style="color:#777">'
				+ '(' + (typeof message) + ')'
				+ '</span>'
				+ '<div style="color:#777;float:right">'
				+ file + ':' + line
				+ '</div>';

			_loggerContainer.appendChild(_logEntry);
		},

		_addLoggerContainer: function () {
			var body = document.getElementsByTagName('body')[0],
				_loggerContainer = document.createElement('div'),
				loggerContainerOuter = document.createElement('div'),
				_header = document.createElement('div');

			loggerContainerOuter.style.display = 'block';
			loggerContainerOuter.style.fontFamily = 'Menlo, monospace';
			loggerContainerOuter.style.textAlign = 'left';
			loggerContainerOuter.style.border = '3px solid #333';
			loggerContainerOuter.style.background = '#fff';
			loggerContainerOuter.style.position = 'fixed';
			loggerContainerOuter.style.top = '10px';
			loggerContainerOuter.style.left = '10px';
			loggerContainerOuter.style.right = '10px';
			loggerContainerOuter.style.opacity = '0.6';



			_header.style.display = 'block';
			_header.style.fontWeight = 'bold';
			_header.style.textAlign = 'center';
			_header.innerHTML = 'Console';

			_loggerContainer.appendChild(_header);
			loggerContainerOuter.appendChild(_loggerContainer);

			this.loggerContainer = _loggerContainer;
			this._addConsoleToLoggerContainer(loggerContainerOuter);
			body.appendChild(loggerContainerOuter);
		},

		_addConsoleToLoggerContainer: function(loggerContainerOuter) {
			var _input = this.input = document.createElement('input'),
				form = document.createElement('form'),
				inputContainer = document.createElement('div');

			_input.type = "text";
			_input.style.width = '100%';
			_input.style.boxSizing = 'border-box';
			_input.style.mozBoxSizing = 'border-box';

			form.setAttribute('method', 'POST');
			form.setAttribute('action', '#');
			form.onsubmit = function(event) {
				event.preventDefault = true;
				eval(this.value);
				return false;
			};

			inputContainer.style.borderTop = '2px solid #444';
			inputContainer.style.clear = 'both';

			form.appendChild(_input);
			inputContainer.appendChild(form);
			loggerContainerOuter.appendChild(inputContainer);
		},

		log: function (message, file, line) {
			this.loggerFunction.call(this.logger, message, file, line);
			return true;
		},

		register: function() {
			var _this = this;
			window.onerror = function (message, file, line) {
				return _this.log(message, file, line);
			};
		}
	};

	return new CunddError;
}));