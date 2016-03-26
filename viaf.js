#! /usr/bin/env node

"use strict"


var program = require('commander'),
	apiRequest = require("./apiRequest")

var exports = module.exports = {}


//for programic usage
exports.searchAny = apiRequest.searchAny
exports.searchServerChoice = apiRequest.searchServerChoice
exports.searchCorporate = apiRequest.searchCorporate
exports.searchGeographic = apiRequest.searchGeographic
exports.searchLCCN = apiRequest.searchLCCN
exports.searchPreferredName = apiRequest.searchPreferredName
exports.searchNames = apiRequest.searchNames
exports.searchPersonalNames = apiRequest.searchPersonalNames
exports.searchSourceRecord = apiRequest.searchSourceRecord
exports.searchTitle = apiRequest.searchTitle
exports.searchExpression = apiRequest.searchExpression
exports.searchWorks = apiRequest.searchWorks

exports.getLccn = apiRequest.getLccn
exports.getViaf = apiRequest.getViaf

exports.setNumberOfRecords = apiRequest.setNumberOfRecords
exports.setCacheSize = apiRequest.setCacheSize


//constants
//the user can reference these search operator constants
exports.ONE_OR_MORE = apiRequest.ONE_OR_MORE
exports.EXACT = apiRequest.EXACT
exports.ANY = apiRequest.ANY
exports.ALL = apiRequest.ALL
exports.LESS = apiRequest.LESS
exports.LESS_EQUAL = apiRequest.LESS_EQUAL
exports.GRATER = apiRequest.GRATER
exports.GRATER_EQUAL = apiRequest.GRATER_EQUAL
exports.NOT = apiRequest.NOT

//and sources for limit
exports.VIAF = apiRequest.VIAF
exports.AUSTRALIA = apiRequest.AUSTRALIA
exports.BELGIUM = apiRequest.BELGIUM
exports.CANADA = apiRequest.CANADA
exports.CZECH = apiRequest.CZECH
exports.EGYPT = apiRequest.EGYPT
exports.FRANCE_BNF = apiRequest.FRANCE_BNF
exports.FRANCE_SUDOC = apiRequest.FRANCE_SUDOC
exports.GERMANY = apiRequest.GERMANY
exports.GETTY = apiRequest.GETTY
exports.HUNGARY = apiRequest.HUNGARY
exports.ISRAEL = apiRequest.ISRAEL
exports.ITALY = apiRequest.ITALY
exports.LOC = apiRequest.LOC
exports.NORWAY = apiRequest.NORWAY
exports.POLAND = apiRequest.POLAND
exports.PORTUGAL = apiRequest.PORTUGAL
exports.SPAIN = apiRequest.SPAIN
exports.SWEDEN = apiRequest.SWEDEN
exports.SWISS_NL = apiRequest.SWISS_NL
exports.SWISS_RERO = apiRequest.SWISS_RERO
exports.RUSSIA = apiRequest.RUSSIA
exports.VATICAN = apiRequest.VATICAN
exports.XA = apiRequest.XA




if(require.main === module){

	//for command line goodness
	program
		.version('0.1.0')
		.usage('[options] <command> "<query>"')
		.option('-o, --operator [value]', 'What search operator to use. See options below')
		.option('-l, --limit [value]', 'To limit record sources. See options below')
		.action(function (command, query) {
			program.command = command
			program.query = query
		})

	program.on('--help', function(){
		console.log('  Commands:');
		console.log('    search              - All Fields (default)')
		console.log('    searchServerChoice  - The server chooses which index to search using this value')
		console.log('    searchCorporate     - Corporate names')
		console.log('    searchGeographic    - Geographic names (only jurisdictional names so far)')
		console.log('    searchLCCN          - Search LCCN (Library of Congress Number) headings')
		console.log('    searchPreferredName - Search in preferred name headings')
		console.log('    searchNames         - Search all name headings')
		console.log('    searchPersonalNames - Search all person name headings')
		console.log('    searchSourceRecord  - Search source record')
		console.log('    searchTitle         - Search titles')
		console.log('    searchExpression    - Search uniform titles (Expressions)')
		console.log('    searchWorks         - Search uniform titles (Works)')
		console.log('    getViaf             - Return data for VIAF id supplied')
		console.log('    getLcnn             - Return data for LCCN id supplied')

		console.log('')
		console.log('  Operators:');
		console.log('    one          - One or more values')
		console.log('    exact        - Exact heading')
		console.log('    any          - Any of the values')
		console.log('    all          - All of the values (default)')
		console.log('    less         - Less than (<)')
		console.log('    lessEquals   - Less than or equals (<=)')
		console.log('    grater       - Grater than (>)')
		console.log('    graterEquals - Grater than or equals (>=)')
		console.log('    not          - Not')
		console.log('')
		console.log('   Limit search to one of these authority sources:')
		console.log('    VIAF, Australia, Belgium, Canada, Czech, Egypt, FranceBnF, FranceSudoc, Germany, Getty, Hungary, Israel, Italy, LOC, Norway, Poland, Portugal, Spain, Sweden, SwissNL, SwissRERO, Russia, Vatican, xA')
		console.log('')
	})


	program.parse(process.argv)

	//map the endpoints, operators and limits
	var commands = {
		'search' : apiRequest.searchAny,
		'searchserverchoice' : apiRequest.searchServerChoice,
		'searchcorporate' : apiRequest.searchCorporate,
		'searchgeographic' : apiRequest.searchGeographic,
		'searchlccn' : apiRequest.searchLCCN,
		'searchpreferredname' : apiRequest.searchPreferredName,
		'searchnames' : apiRequest.searchNames,
		'searchpersonalnames' : apiRequest.searchPersonalNames,
		'searchsourcerecord' : apiRequest.searchSourceRecord,
		'searchtitle' : apiRequest.searchTitle,
		'searchexpression' : apiRequest.searchExpression,
		'searchworks' : apiRequest.searchWorks,
		'getviaf' : apiRequest.getViaf,
		'getlccn' : apiRequest.getLccn
	}
	var operators = {
		'one' : apiRequest.ONE_OR_MORE,
		'exact' : apiRequest.EXACT,
		'any' : apiRequest.ANY,
		'all' : apiRequest.ALL,
		'less' : apiRequest.LESS,
		'lessequals' : apiRequest.LESS_EQUAL,
		'grater' : apiRequest.GRATER,
		'graterequals' : apiRequest.GRATER_EQUAL,
		'not' : apiRequest.NOT
	}
	var limits = {
		'viaf' : apiRequest.VIAF,
		'australia' : apiRequest.AUSTRALIA,
		'belgium' : apiRequest.BELGIUM,
		'canada' : apiRequest.CANADA,
		'czech' : apiRequest.CZECH,
		'egypt' : apiRequest.EGYPT,
		'francebnf' : apiRequest.FRANCE_BNF,
		'francesudoc' : apiRequest.FRANCE_SUDOC,
		'germany' : apiRequest.GERMANY,
		'getty' : apiRequest.GETTY,
		'hungary' : apiRequest.HUNGARY,
		'israel' : apiRequest.ISRAEL,
		'italy' : apiRequest.ITALY,
		'loc' : apiRequest.LOC,
		'norway' : apiRequest.NORWAY,
		'poland' : apiRequest.POLAND,
		'portugal' : apiRequest.PORTUGAL,
		'spain' : apiRequest.SPAIN,
		'sweden' : apiRequest.SWEDEN,
		'swissnl' : apiRequest.SWISS_NL,
		'swissrero' : apiRequest.SWISS_RERO,
		'russia' : apiRequest.RUSSIA,
		'vatican' : apiRequest.VATICAN,
		'xa' : apiRequest.XA
	}

	var command = commands['search'], options = {}

	options.operator = operators['all']

	if (typeof program.command == 'function'){
		console.log("Please supply a command, try \"viaf --help\"")
		process.exit(1)
	}

	if (program.command){

		if (commands[program.command.toLowerCase()]){

			command = commands[program.command.toLowerCase()]
		}else{
			console.log("No such command, try \"viaf --help\"")
			process.exit(1)
		}

	}

	if (typeof program.query != 'string'){
			console.log("No query supplied \"viaf --help\"")
			process.exit(1)
	}

	if (program.operator){
		if (operators[program.operator]){
			options.operator = operators[program.operator]
		}else{
			console.log("No such operator, try \"viaf --help\"")
			process.exit(1)
		}
	}
	if (program.limit && program.limit.toLowerCase()){
		if (limits[program.limit.toLowerCase()]){
			options.limit = limits[program.limit.toLowerCase()]
		}else{
			console.log("No such limit code, try \"viaf --help\"")
			process.exit(1)
		}
	}

	//do the search
	command(program.query,options)
		.then(function(records){

			process.stdout.write(JSON.stringify(records))
			process.exit(0)
		})
		.fail(function(error){

			process.stderr.write(error)
			process.stdout.write('false')
			process.exit(1)
		})

}





