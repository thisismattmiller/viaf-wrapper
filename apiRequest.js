//talks to the server

"use strict"


var request   = require('request'),
	apiConfig = require('./apiConfig'),
	querystring = require('querystring'),
	apiCache = require('./apiCache'),
	apiProcess = require('./apiProcess'),
	Q = require('q')

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
	return exports.search('searchAny',query,options,cb)
}

exports.searchServerChoice = function(query,options,cb){
	return exports.search('searchServerChoice',query,options,cb)
}

exports.searchCorporate = function(query,options,cb){
	return exports.search('searchCorporate',query,options,cb)
}
exports.searchGeographic = function(query,options,cb){
	return exports.search('searchGeographic',query,options,cb)
}
exports.searchLCCN = function(query,options,cb){
	return exports.search('searchLCCN',query,options,cb)
}

exports.searchPreferredName = function(query,options,cb){
	return exports.search('searchPreferredName',query,options,cb)
}

exports.searchNames = function(query,options,cb){
	return exports.search('searchNames',query,options,cb)
}

exports.searchPersonalNames = function(query,options,cb){
	return exports.search('searchPersonalNames',query,options,cb)
}

exports.searchSourceRecord = function(query,options,cb){
	return exports.search('searchSourceRecord',query,options,cb)
}

exports.searchTitle = function(query,options,cb){
	return exports.search('searchTitle',query,options,cb)
}

exports.searchExpression = function(query,options,cb){
	return exports.search('searchExpression',query,options,cb)
}

exports.searchWorks = function(query,options,cb){
	return exports.search('searchWorks',query,options,cb)
}

//used for testing
exports.searchError = function(query,options,cb){
	return exports.search('searchError',query,options,cb)
}

exports.search = function(type,query,options,cb){

	var deferred = Q.defer();


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

	if (!hasQuery) deferred.reject("No Query")


	qs = exports.buildSearchUrl(type,query,options)

	//see if this query is already in the cache if so return that instead
	var cacheResults = apiCache.return(qs)
	if (cacheResults){
		//yes
		if (options.raw){
			deferred.resolve(cacheResults.raw)
		}else{
			//console.log("Using Cache")
			//we have the cached response return it
			deferred.resolve(cacheResults.data)
		}

	}else{

		//make the request
		request(qs, function (error, response, body) {

			if (!body) var body = ""

			if (error){
				if (error.errno === 'ENOTFOUND'){
					console.error("Cannot connect to the internet")
				}
				deferred.reject(error)
			}else if (response.statusCode!=200){
				deferred.reject(response.statusCode)
			}else{

				if (options.raw){
					deferred.resolve(body)
				}else{

					//okay we want to process the record
					var records = apiProcess.splitSearchResults(body, function(results){

						var recordArray = []

						//send each one to the processor
						for (var x in results.records){
							recordArray.push( apiProcess.combineResults(results.records[x]))
						}
						//cache it
						apiCache.add(qs,recordArray,body)

						//return it
						deferred.resolve(recordArray)

					})

				}

			}


		})

	}


	deferred.promise.nodeify(cb)
	return deferred.promise
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
		if (x === 'start'){
			startRecord =  options.start
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
	qs += "&" + apiConfig.search.recordsStart.replace("{X}",startRecord)

	//return type
	qs += "&" + acceptHeader

	if (type==='searchError') qs = qs.replace('search?','searcherror?')

	return qs


}

//get the viaf id and return a processed record
exports.getLccn = function(id,cb){

	return exports.getViaf(id,cb)

}

//get the viaf id and return a processed record
exports.getViaf = function(id,cb){


	var deferred = Q.defer();

	if (!id) deferred.reject("No ID")

	id=id.toString()

	if (id.charAt(0)=='n'){
		var qs = apiConfig.get.lccnURL.replace("{X}",id)
	}else{
		var qs = apiConfig.get.viafURL.replace("{X}",id)
	}

	//make the request
	request(qs, function (error, response, body) {

		if (!body) var body = ""

		if (error){
			if (error.errno === 'ENOTFOUND'){
				console.error("Cannot connect to the internet")
			}
			deferred.reject(error)
		}else if (response.statusCode!=200){
			deferred.reject(response.statusCode)
		}else{



			//okay we want to process the record
			var records = apiProcess.splitSearchResults(body, function(results){


				var record = apiProcess.combineResults(results.records[0])

				//return it
				deferred.resolve(record)

			})


		}


	})




	deferred.promise.nodeify(cb)
	return deferred.promise



}



exports.setNumberOfRecords = function(intVal){
	apiConfig.numberOfRecords = intVal
}
exports.setCacheSize= function(intVal){
	apiConfig.cacheSize = intVal
}