//talks to the server

"use strict"


var request   = require('request'),
	apiConfig = require('./apiConfig'),
	querystring = require('querystring')

var exports = module.exports = {}

//setup the constants
var numberOfRecords = apiConfig.search.numberOfRecords



//the user can reference these search operator constants
exports.ONE_OR_MORE = apiConfig.search.operatorOneOrMore
exports.EXACT = apiConfig.search.operatorExact
exports.ANY = apiConfig.search.operatorAny
exports.ALL = apiConfig.search.operatorAll
exports.LESS = apiConfig.search.operatorLess
exports.LESS_EQUAL = apiConfig.search.operatorLessEqual
exports.GRATER = apiConfig.search.operatorGrater
exports.GRATER_EQUAL = apiConfig.search.operatorGraterEqual
exports.NOT = apiConfig.search.operatorNot

//and sources for limit
exports.VIAF = apiConfig.search.limitSourceVIAF
exports.AUSTRALIA = apiConfig.search.limitSourceAustralia
exports.BELGIUM = apiConfig.search.limitSourceBelgium
exports.CANADA = apiConfig.search.limitSourceCanada
exports.CZECH = apiConfig.search.limitSourceCzech
exports.EGYPT = apiConfig.search.limitSourceEgypt
exports.FRANCE_BNF = apiConfig.search.limitSourceFranceBnF
exports.FRANCE_SUDOC = apiConfig.search.limitSourceFranceSudoc
exports.GERMANY = apiConfig.search.limitSourceGermany
exports.GETTY = apiConfig.search.limitSourceGetty
exports.HUNGARY = apiConfig.search.limitSourceHungary
exports.ISRAEL = apiConfig.search.limitSourceIsrael
exports.ITALY = apiConfig.search.limitSourceItaly
exports.LOC = apiConfig.search.limitSourceLOC
exports.NORWAY = apiConfig.search.limitSourceNorway
exports.POLAND = apiConfig.search.limitSourcePoland
exports.PORTUGAL = apiConfig.search.limitSourcePortugal
exports.SPAIN = apiConfig.search.limitSourceSpain
exports.SWEDEN = apiConfig.search.limitSourceSweden
exports.SWISS_NL = apiConfig.search.limitSourceSwissNL
exports.SWISS_RERO = apiConfig.search.limitSourceSwissRERO
exports.RUSSIA = apiConfig.search.limitSourceRussia
exports.VATICAN = apiConfig.search.limitSourceVatican
exports.XA = apiConfig.search.limitSourcexA


//bindings to the search function
exports.searchAny = function(query,options,cb){
	exports.search('searchAny',query,options,cb)
}


exports.search = function(type,query,options,cb){


	var hasQuery = (typeof query === 'string') ? true : false,
		hasOptions = (typeof(options) !== "function" && typeof(options) === "object" ) ? true : false,
		hasCallback = (typeof(cb) === "function") ? true : false,
		qs = ""

	//just query and callback no options
	if (!hasOptions){
		if (typeof(options) === "function"){
			var cb = options
			hasCallback = true
		}
	}	

	//it should be empty if not passed
	if (!hasOptions) var options = {}

	if (!hasQuery) return false


	qs = exports.buildSearchUrl(type,query,options)

	
	//make the request
	request(qs, function (error, response, body) {

		var data = false

		if (!body) var body = ""

		if (error){
			if (error.errno === 'ENOTFOUND'){
				console.error("Cannot connect to the internet")
			}

			if (cb) cb(false)

			return false
		}



		if (options.raw){
			if (cb) cb(body)
		}else{
			if (cb) cb(data)
		}

		

	})
	


}


//build up the query string based on the options, exposed for testing
exports.buildSearchUrl = function(type,query,options){

	//defaults
	var operator = exports.ALL,
		ts = "",
		maxRecord = apiConfig.config.numberOfRecords,
		startRecord = 1,
		acceptHeader = apiConfig.search.acceptXML,
		limit = false



	for (var x in options){
		if (x === 'operator'){
			operator =  options.operator
		}
		if (x === 'limit'){
			limit =  options.limit
		}

	}

	//loop though the types of searchs and grab that string if the type matches
	for (var x in apiConfig.search){
		if (x === type){
			ts = apiConfig.search[x]
		}
	}



	//build query string, viaf uses "+" to seperate their operations we leave the base off until later to escape it all
	var qs = apiConfig.search.base

	//replace the query string and operator
	qs += ts.replace('{X}',querystring.escape(query)).replace('{OP}',querystring.escape(operator))

	if (limit){
		qs += apiConfig.search.limitSourceSyntax.replace('{X}',limit)
	}

	//sort key
	qs += "&" + apiConfig.search.sortKey

	//how many records
	qs += "&" + apiConfig.search.recordsMax.replace("{X}",maxRecord)

	//start record
	qs += "&" + acceptHeader


	return qs


}

