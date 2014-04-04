'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var ControllerGenerator = module.exports = function ControllerGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);

	this.controllerName = this.name;

	//this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(ControllerGenerator, yeoman.generators.NamedBase);

ControllerGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	var prompts = [
		{
			name: 'appNS',
			message: 'What\'s the namespace of your app?',
			default: 'APP'
		},
		{
			name: 'jsPath',
			message: 'What is the path to your theme\'s JavaScript folder?',
			default: 'wp-content/themes/hantheme/assets/js/'
		}
	];

	this.prompt(prompts, function (props) {
		this.appNS = props.appNS;
		this.jsPath = props.jsPath;

		cb();
	}.bind(this));
};

ControllerGenerator.prototype.files = function files() {
	this.template('js/APP/controllers/controller.js', this.jsPath + '/' + this.appNS + '/controllers/' + this.controllerName + '.js');
};
