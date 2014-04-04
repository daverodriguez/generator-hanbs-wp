(function() {
	/**
	 * @exports <%= appNS %>.controllers.<%= controllerName %>
	 * @requires HBS
	 */
	var module = {};

	module.init = function() {
		console.log('Hi from <%= controllerName %>.init()');
	};

	module.examplePage = function() {
		console.log('Hi from <%= controllerName %>.examplePage()');

	};

	HBS.namespace('<%= appNS %>.controllers.<%= controllerName %>', module);
}());