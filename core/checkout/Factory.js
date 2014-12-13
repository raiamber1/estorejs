var CheckoutAssistant =
	require('./CheckoutAssistant');

var CheckoutAssistantHandlerWrapper =
	require('./CheckoutAssistantHandlerWrapper');

var AjaxCheckoutAssistantHandler =
	require('./AjaxCheckoutAssistantHandler');

var StandardCheckoutHandler =
	require('./StandardCheckoutAssistantHandler');

/**
 * Assistants
 * @memberOf core/checkout
 */

module.exports = {

	createAjaxAssistant: function(dao, req, res, controllers, callbacks) {

		return new CheckoutAssistant(dao, controllers,
			new CheckoutAssistantHandlerWrapper(dao, req.session, callbacks,
				new AjaxCheckoutAssistantHandler(res)),
			callbacks);

	},
	createStandardAssistant: function(dao, req, res, next, controllers, callbacks) {

		return new CheckoutAssistant(dao, controllers,
			new CheckoutAssistantHandlerWrapper(dao, req.session, callbacks,
				new StandardCheckoutHandler(res, next)),
			callbacks);

	},





};
