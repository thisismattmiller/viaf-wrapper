var should = require('should'),
	apiRequest = require("../apiRequest.js")

describe('apiRequest', function () {

	this.timeout(25000);


	it('search - callback', function (done) {
		apiRequest.searchPreferredName("Jack Kerouac, 1922-1969", function(error, records){ 
		
			if (error){
				throw "Error: " + error.toString()
			}
			records.length.should.be.above(1)			 
			done()

		})
	})

	it('search - promises', function (done) {
		apiRequest.searchPreferredName("Jack Kerouac, 1922-1969")
		.then(function (records) {
			records.length.should.be.above(1)
			done()
		})
		.fail(function (error) {
			done()
		})
	})


	it('search - callback - error', function (done) {
		apiRequest.searchError("Jack Kerouac, 1922-1969", function(error, records){ 
		
			if (!error){
				throw "Did not error out"
			}
			done()

		})
	})

	it('search - promises - error', function (done) {
		apiRequest.searchError("Jack Kerouac, 1922-1969")
		.then(function (records) {
			done()
		})
		.fail(function (error) {
			if (!error){
				throw "Did not error out"
			}
			done()
		})
	})



	//test the url generator
	it('buildSearchUrl - default', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - ONE_OR_MORE', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.ONE_OR_MORE })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3D+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - EXACT', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.EXACT })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+exact+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - ANY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.ANY })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+any+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - ALL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.ALL })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - LESS', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.LESS })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3C+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - LESS_EQUAL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.LESS_EQUAL })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3C%3D+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - GRATER', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.GRATER })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3E+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - GRATER_EQUAL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.GRATER_EQUAL })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3E%3D+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - NOT', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.NOT })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+not+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})


	//----------

	it('buildSearchUrl - type - searchAny', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchServerChoice', function (done) {
		var r = apiRequest.buildSearchUrl('searchServerChoice','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=cql.serverChoice+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchCorporate', function (done) {
		var r = apiRequest.buildSearchUrl('searchCorporate','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.corporateNames+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchGeographic', function (done) {
		var r = apiRequest.buildSearchUrl('searchGeographic','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.geographicNames+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchLCCN', function (done) {
		var r = apiRequest.buildSearchUrl('searchLCCN','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.LCCN+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchPreferredName', function (done) {
		var r = apiRequest.buildSearchUrl('searchPreferredName','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.mainHeadingEl+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchNames', function (done) {
		var r = apiRequest.buildSearchUrl('searchNames','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.names+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchPersonalNames', function (done) {
		var r = apiRequest.buildSearchUrl('searchPersonalNames','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.personalNames+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchSourceRecord', function (done) {
		var r = apiRequest.buildSearchUrl('searchSourceRecord','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.source+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchTitle', function (done) {
		var r = apiRequest.buildSearchUrl('searchTitle','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.title+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchExpression', function (done) {
		var r = apiRequest.buildSearchUrl('searchExpression','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.uniformTitleExpressions+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchWorks', function (done) {
		var r = apiRequest.buildSearchUrl('searchWorks','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.uniformTitleWorks+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})



	//source limit

	it('buildSearchUrl - source limit - VAIF', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.VIAF})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"viaf"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - AUSTRALIA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.AUSTRALIA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nla"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - BELGIUM', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.BELGIUM})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"vlacc"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - CANADA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.CANADA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"lac"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - CZECH', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.CZECH})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nkc"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - EGYPT', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.EGYPT})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"egaxa"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - FRANCE_BNF', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.FRANCE_BNF})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bnf"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - FRANCE_SUDOC', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.FRANCE_SUDOC})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"sudoc"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - GERMANY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.GERMANY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"dnb"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - GETTY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.GETTY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"jpg"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - HUNGARY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.HUNGARY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nszl"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - ISRAEL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.ISRAEL})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nliara"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - ITALY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.ITALY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"iccu"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - LOC', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.LOC})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"lc"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - NORWAY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.NORWAY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bibsys"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - POLAND', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.POLAND})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nukat"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - PORTUGAL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.PORTUGAL})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"ptbnp"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SPAIN', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SPAIN})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bne"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SWEDEN', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SWEDEN})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"selibr"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SWISS_NL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SWISS_NL})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"swnl"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SWISS_RERO', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SWISS_RERO})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"rero"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - RUSSIA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.RUSSIA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"rsl"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - VATICAN', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.VATICAN})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bav"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - XA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.XA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"xa"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	





})