'use strict';
// =========================================================================
//
// Controller for streams
//
// =========================================================================
var path     = require('path');
var DBModel  = require (path.resolve('./modules/core/server/controllers/core.dbmodel.controller'));


module.exports = DBModel.extend ({
	name : 'Stream',
	populate: 'phases',
	preprocessAdd: function (stream) {
		stream.roles.push (
			'eao:admin',
			'eao:working-group',
			'eao:member',
			'eao:consultant',
			'eao:first-nations'
		);
		stream.submit.push ('project:eao:admin');
		return stream;
	},
	addPhaseToStream : function (stream, phasebase) {
		var self = this;
		return new Promise (function (resolve, reject) {
			stream.phases.push (phasebase._id);
			self.saveAndReturn(stream)
			.then (resolve, reject);
		});
	}
});


