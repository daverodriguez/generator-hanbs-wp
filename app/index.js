'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var HanbsWpGenerator = module.exports = function HanbsWpGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(HanbsWpGenerator, yeoman.generators.Base);

HanbsWpGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [
		{
			name: 'appName',
			message: 'What would you like call this app?',
			default: 'HanBootStrap Project'
		},
		{
			name: 'appNS',
			message: 'What would you like to use as the namespace for this app?',
			default: 'APP'
		},
		{
			name: 'jsPath',
			message: 'What is the path to your theme\'s JavaScript folder?',
			default: 'wp-content/themes/hantheme/assets/js/'
		},
		{
			type: 'confirm',
			name: 'createController',
			message: 'Would you like to generate a section controller?',
			default: true
		},
		{
			when: function(props) { return props.createController === true; },
			name: 'controllerName',
			message: 'What should I call the controller?',
			default: 'home'
		}
	];

	this.prompt(prompts, function (props) {
		this.appName = props.appName;
		this.appNS = props.appNS;
		this.jsPath = props.jsPath;

		this.createController = props.createController;
		if (this.createController === true) {
			this.controllerName = props.controllerName;
		}

		cb();
	}.bind(this));
};

HanbsWpGenerator.prototype.app = function app() {
	this.template('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');
};

HanbsWpGenerator.prototype.projectfiles = function projectfiles() {
	this.copy('editorconfig', '.editorconfig');
	this.copy('jshintrc', '.jshintrc');

	this.mkdir(this.jsPath);

	this.mkdir(this.jsPath + '/' + 'lib');
	this.template('js/lib/hbs.js', this.jsPath + '/' + 'lib/hbs.js');

	this.mkdir(this.jsPath + '/' + this.appNS);
	this.template('js/APP/main.js', this.jsPath + '/' + this.appNS + '/main.js');

	if (this.createController) {
		this.mkdir(this.jsPath + '/' + this.appNS + '/controllers');
		this.template('js/APP/controllers/controller.js', this.jsPath + '/' + this.appNS + '/controllers/' + this.controllerName + '.js');
	}

	//this.template('js/lib/jquery-1.10.2.min.js', 'js/lib/jquery-1.10.2.min.js');
	//this.template('js/lib/modernizr-2.6.2.min.js', 'js/lib/modernizr-2.6.2.min.js');
};
