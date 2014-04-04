BOOTSTRAP = {
	ns: 'HAN',	// Default namespace
	debugMode: true,
	autoInitAsync: true,
	exec: function( location, action ) {

		// Default action to init if not defined
		var action = ( action === undefined ) ? 'init' : action;
		var packageParts = BOOTSTRAP.getPackageArray(location);
		var target = window;
		var nextPart;

		// If no data-location is specified, stop
		if (location === "" || packageParts.length === 0 || packageParts[0] === "") {
			return;
		}

		console.log('Bootstrapping ' + packageParts.join(".") + '.' + action + '()');

		for (var i = 0, max = packageParts.length; i < max; i++) {
			nextPart = packageParts[i];
			target[nextPart] = target[nextPart] || {};
			target = target[nextPart];
		}

		if (target && target.hasOwnProperty(action) && typeof(target[action]) === 'function') {
			target[action].call();
		} else {
			console.log('Not found');
		}
	},

	init: function() {
		var body = document.body,
			location = body.getAttribute('data-location'),
			action = body.getAttribute('data-action'),
			asyncScript = body.getAttribute('data-async-script');

		BOOTSTRAP.exec(BOOTSTRAP.ns + '.common');
		if (BOOTSTRAP.autoInitAsync === true && asyncScript) {
			BOOTSTRAP.initPageAsync(asyncScript, location, action);
		} else {
			BOOTSTRAP.exec(location);
			if (action) { BOOTSTRAP.exec(location, action); }
		}
	},

	initPageAsync: function(script, location, action) {
		if (!script) {
			return;
		}

		var script = BOOTSTRAP.getScriptPath(script);

		if ( typeof(window[location]) !== 'function') {
			console.log("Beginning asynchronous load of " + script);
			$.getScript(script).done(function(script, textStatus) {
				BOOTSTRAP.exec(location);
				if (action) { BOOTSTRAP.exec(location, action); }
			}).fail(function() {
				console.log("Unable to load " + script);
			});

		} else {
			BOOTSTRAP.exec(location);
			if (action) { BOOTSTRAP.exec(location, action); }
		}

	},

	extend: function(pkg, func) {
		var packageParts = BOOTSTRAP.getPackageArray(pkg);
		var target = window;

		for (var i = 0, max = packageParts.length; i < max; i++) {
			nextPart = packageParts[i];
			target[nextPart] = target[nextPart] || {};
			if (i === max - 1) {
				target[nextPart] = func.call();
			} else {
				target = target[nextPart];
			}
		}
	},

	getPackageArray: function(pkg) {
		return (typeof(pkg) !== 'string') ? '' : pkg.split('.');
	},

	getScriptPath: function(scriptName) {
		if (/^\/\//.test(scriptName)) {
			scriptName = document.location.protocol + scriptName;
		}
		return scriptName;
	}
};

// Initialize bootstrap function
$( document ).ready(BOOTSTRAP.init);
