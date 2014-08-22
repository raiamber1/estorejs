/**
 * Transaction represents the state of an order.
 *
 * Because of MongoDB's preference for atmoic operations over transactions,
 * we have to consider errors occuring during multi collection updates (operations are only atomic per colelction).
 *
 * I tried a 2 phase commit thing here as a single order may require more than one collections to be updated.
 * The key here is not to avoid errors but rather to avoid an unrecoverable state of any collection(s).
 *
 * More info:
 *
 * http://docs.mongodb.org/manual/tutorial/perform-two-phase-commits/
 *
 * @class Transaction
 *
 * @constructor
 *
 */
module.exports = function Transaction(store) {

	var t = store.keystone.Field.Types;
	this.NAME = 'Transaction';

	this.options = {
		nocreate: true,
		noedit: true,
		hidden: true,
	};

	this.fields = [{
		invoice: require('./InvoiceFields')(t),
		status: {
			type: t.Select,
			options: 'pending,comitted,error,rollback,done',
			default: 'pending'
		}

	}];

	/**
	 * run
	 *
	 * @method run
	 * @param {List} list
	 * @return
	 *
	 */
	this.run = function(list) {

		list.schema.add({
			items: Array
		});

		list.schema.statics.getPending = function(limit) {

			var that = this.model('Transaction').find({
				status: 'pending'
			}).limit(limit);

			return require('q').ninvoke(that, 'exec').
			catch (function(err) {

				system.log.error(err);

			});


		};

		list.schema.methods.promiseInvoice = function() {

			var invoice = this.model('Invoice').create(this.invoice);
			return invoice.onReject(function(err) {
				system.log.error('Error occured while starting transaction:', err);

			});

		};


		list.schema.methods.start = function() {

			return this.model('Transaction').create(this).
			onReject(function(err) {
				system.log.error('Error occured while starting transaction: ', err);
			});


		};

	};

};