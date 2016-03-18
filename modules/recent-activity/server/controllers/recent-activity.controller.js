'use strict';
// =========================================================================
//
// Controller for orgs
//
// =========================================================================
var path     = require('path');
var DBModel   = require (path.resolve('./modules/core/server/controllers/core.dbmodel.controller'));
var _         = require ('lodash');

module.exports = DBModel.extend ({
	name : 'RecentActivity',
	plural : 'recentactivities'
});
