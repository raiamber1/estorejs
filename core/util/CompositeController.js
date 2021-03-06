var Composite = require('./Composite');
/**
 * CompositeController makes managing multiple extensions easier.
 * @class CompositeController
 * @constructor
 *
 */
module.exports = function CompositeController() {

	var add = this.add.bind(this);

	/**
	 * add an extension to the system.
	 *
	 * Before an extension is added, information about is taken an added to the
	 * settings model.
	 *
	 * @method add
	 * @param {Controller} ext
	 * @return
	 *
	 */
	this.add = function(ext) {
		add(ext);

	};


	/**
	 * onRouteConfiguration
	 *
	 * @method onRouteConfiguration
	 * @param {Object} app
	 * @return CompositeController
	 *
	 */
	this.onRouteConfiguration = function(app) {
		this._callEach('onRouteConfiguration', app);
		return this;
	};

	/**
	 * gatewayRegistration
	 *
	 * @method gatewayRegistration
	 * @param {Array} gateways
	 * @return
	 *
	 */
	this.gatewayRegistration = function(gateways) {

		this._callEach('gatewayRegistration', gateways);
		return this;



	};



	/**
	 * modelRegistration
	 *
	 * @method modelRegistration
	 * @param {ModelRegistrar} reg
	 * @return CompositeController
	 *
	 */
	this.modelRegistration = function(reg) {
		this._callEach('modelRegistration', reg);
		return this;
	};


	/**
	 * onGetPaymentOptions
	 *
	 * params
	 *
	 */
	this.onGetPaymentOptions = function(options) {
		this._callEach('onGetPaymentOptions', options);
		return this;


	};

	/**
	 * onGetGateways
	 *
	 * params
	 *
	 */
	this.onGetGateways = function(gateways) {

		this._callEach('onGetGateways', gateways);
		return this;


	};




};

module.exports.prototype = new Composite();
