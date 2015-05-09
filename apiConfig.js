// The URL params and such for the api

"use strict"

var exports = module.exports = {}


exports.config = {


	//number of previous requests to hold in memeory
	cacheSize: 100,

	//the default number of records to return
	numberOfRecords: 50


}

exports.get = {

	viafURL : "http://viaf.org/viaf/{X}/viaf.xml",
	lccnURL : "http://viaf.org/viaf/lccn/{X}/viaf.xml"

}


exports.search = {

	base :					"http://viaf.org/viaf/search?query=",

	acceptHTML :			"httpAccept=text/html",
	acceptRSS :				"httpAccept=application/rss+xml",
	acceptXML :				"httpAccept=application/xml",

	recordsMax :			"maximumRecords={X}",
	recordsStart :			"startRecord={X}",
	sortKey :				"sortKeys=holdingscount",

	operatorOneOrMore :		"=",
	operatorExact :			"exact",
	operatorAny :			"any",
	operatorAll :			"all",
	operatorLess :			"<",
	operatorLessEqual :		"<=",
	operatorGrater :		">",
	operatorGraterEqual :	">=",
	operatorNot :			"not",
	
	searchAny :				'cql.any+{OP}+"{X}"',
	searchServerChoice :	'cql.serverChoice+{OP}+"{X}"',
	searchCorporate :		'local.corporateNames+{OP}+"{X}"',
	searchGeographic :		'local.geographicNames+{OP}+"{X}"',
	searchLCCN :			'local.LCCN+{OP}+"{X}"',
	searchPreferredName :	'local.mainHeadingEl+{OP}+"{X}"',
	searchNames :			'local.names+{OP}+"{X}"',
	searchPersonalNames :	'local.personalNames+{OP}+"{X}"',
	searchSourceRecord :	'local.source+{OP}+"{X}"',
	searchTitle :			'local.title+{OP}+"{X}"',
	searchExpression :		'local.uniformTitleExpressions+{OP}+"{X}"',
	searchWorks :			'local.uniformTitleWorks+{OP}+"{X}"',

	//for testing
	searchError:			'?ERR&OR+{OP}+"{X}"',


	limitSourceVIAF :		"viaf",        
	limitSourceAustralia :	"nla",    
	limitSourceBelgium :	"vlacc",    
	limitSourceCanada :		"lac",       
	limitSourceCzech :		"nkc",        
	limitSourceEgypt :		"egaxa",      
	limitSourceFranceBnF : 	"bnf",    
	limitSourceFranceSudoc :"sudoc",
	limitSourceGermany : 	"dnb",      
	limitSourceGetty : 		"jpg",        
	limitSourceHungary : 	"nszl",     
	limitSourceIsrael : 	"nliara",    
	limitSourceItaly : 		"iccu",       
	limitSourceLOC : 		"lc",           
	limitSourceNorway : 	"bibsys",    
	limitSourcePoland : 	"nukat",     
	limitSourcePortugal : 	"ptbnp",   
	limitSourceSpain : 		"bne",        
	limitSourceSweden : 	"selibr",    
	limitSourceSwissNL : 	"swnl",     
	limitSourceSwissRERO : 	"rero",   
	limitSourceRussia : 	"rsl",       
	limitSourceVatican : 	"bav",      
	limitSourcexA : 		"xa",        

	limitSourceSyntax : 	'+and+local.sources+%3D+"{X}"'    




}