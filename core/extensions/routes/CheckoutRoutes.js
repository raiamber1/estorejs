var render = require('./render');

/**
 * CheckoutBindings
 * @class CheckoutBindings
 * @param {EStore} store
 * @constructor
 *
 */
module.exports = function CheckoutBindings(store) {

	/**
	 * routeRegistration
	 * @method routeRegistration
	 * @return
	 *
	 */
	this.routeRegistration = function(app) {

		app.get('/checkout', this.onCheckoutPageRequest);
		app.get('/checkout/error', render('checkout/error.html'));
		app.get(/^\/checkout\/success\/([a-f\d]{24})$/,
			this.onCheckoutSuccessPageRequest);

	};

	/**
	 * onCheckoutSuccessPageRequest
	 *
	 * @method CheckoutSuccessPageRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onCheckoutSuccessPageRequest = function(req, res, next) {

		//TODO
		//In future do not query using mongo _ids

		store.keystone.list('Transaction').model.findOne({
			_id: req.params[0]
		}).
		exec().
		then(null, function(err) {

			console.log(err) && next();

		}).
		then(function(trn) {

			if (!trn)
				return next();

			res.locals.order = trn;

			if (trn.invoice.payment.type !== 'card')
				if (store.settings.payments[trn.type])
					res.locals.$page = store.settings.payments[trn.type];

			render('checkout/success.html')(req, res, next);

		}).end();


	};


	/**
	 * onCheckoutPageRequest
	 *
	 * @method CheckoutPageRequest
	 * @param {Object} req The express Request object.
	 * @param {Object} res The express Response object.
	 * @return
	 *
	 */
	this.onCheckoutPageRequest = function(req, res, next) {

		if (req.session.cart.length < 1)
			return res.redirect('/cart');

		render('checkout/index.html')(req, res, next);
	};
};
