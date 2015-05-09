var should = require('should'),
	apiRequest = require("../apiRequest.js")

describe('apiRequest', function () {

	this.timeout(25000);

	var randomNames = ["Trinh Guyton", "Vita Guess", "Meri Warkentin", "Fumiko Clinkscales", "Lavada Pressly", "Stanton Gilchrest", "Jeanne Rhymes", "Irvin Golson", "Delana Altizer", "Lavon Meraz", "Vikki Singleterry", "Benjamin Neiman", "Dennise Calaway", "Minda Glenn", "James Leiva", "Horace Cloninger", "Letty Odoms", "Lyndia Etherton", "Myrta Candler", "Otha Gravelle", "Alicia Musgrave", "Temple Baumgardner", "Odis Fredrick", "Rossie Shin", "Shanika Berner", "Shakita Shores", "Verda Christner", "Jenise Aigner", "Brendon Coto", "Dannielle Woltz", "Nicolette Rountree", "Effie Tarin", "Hye Stoddart", "Danilo Godley", "Adell Guadarrama", "Stacey Fillion", "Harmony Remigio", "Emiko Drumm", "Ben Krzeminski", "Lucienne Raymond", "Salley Palos", "Jovita Linn", "Dallas Goodsell", "Ashanti Chilton", "Erica Mcginness", "Harriet Sturdevant", "Aurelio Mclain", "Lilliam Boley", "Ayana Collington", "Garth Marcil", "Thersa Seppala", "Qiana Dinh", "Ed Frei", "Wilbert Ryer", "Kip Polk", "Kirstie Castorena", "Jona Dealba", "Lakeisha Kinsella", "Larry Sontag", "Millard Sugarman", "Jeramy Quiles", "Shayla Layton", "Alden Maddix", "Jacquelyn Sarabia", "Ophelia Davila", "Geraldine Breland", "Karry Dazey", "Laine Hight", "Quiana Delaughter", "Abdul Ming", "Susann Newingham", "Particia Shuler", "Rae Kirst", "Pasty Bonar", "Carola Funderburg", "Bok Carrozza", "Lloyd Dantin", "Shona Chillemi", "Marita Lopp", "Harvey Schexnayder", "Silvia Legleiter", "Charity Mapp", "Janiece Gleaves", "Jessenia Brite", "Clarisa Muck", "Nana Foraker", "Annis Raskin", "Mandi Longway", "Marlin Mah", "Sylvia Hurwitz", "Bradly Cullens", "Joya Fell", "Awilda Kuehl", "Jene Mckinnis", "Kory Boss", "Nicolasa Goodall", "Miyoko Mckinstry", "Dalila Caraveo", "Maribeth Spoor", "Jacqualine Hahn"]


	it('get - lccn', function (done) {


		apiRequest.getLccn('n79032879')
		.then(function (record) {

			record.heading.should.equal('Austen, Jane, 1775-1817.')
			record.nationalityOfEntityTop.should.equal('GB')

			done()

		})
		.fail(function (error) {
			throw error
			done()
		})
	})


	it('get - viaf', function (done) {


		apiRequest.getViaf('102333412')
		.then(function (record) {

			record.heading.should.equal('Austen, Jane, 1775-1817.')
			record.nationalityOfEntityTop.should.equal('GB')

			done()

		})
		.fail(function (error) {
			throw error
			done()
		})
	})



	//test the cache
	it('search - cache', function (done) {
		apiRequest.searchPreferredName("Jack Kerouac, 1922-1969")
		.then(function (records) {

			apiRequest.searchPreferredName("Jack Kerouac, 1922-1969")
				.then(function (records) {

					records.length.should.be.above(1)	
					done()
				})
				.fail(function (error) {
					throw error
					done()
				})


		})
		.fail(function (error) {
			throw error
			done()
		})
	})




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
			throw error
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


	//random tests
	//do a random name for each endpoint
	it('random search - searchAny', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchAny(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	it('random search - searchServerChoice', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchServerChoice(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	it('random search - searchCorporate', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchCorporate(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	it('random search - searchPreferredName', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchPreferredName(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})


	it('random search - searchNames', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchNames(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})


	it('random search - searchPersonalNames', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchPersonalNames(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	it('random search - searchSourceRecord', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchSourceRecord(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	it('random search - searchTitle', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchTitle(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	it('random search - searchExpression', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchExpression(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	it('random search - searchWorks', function (done) {
		var n = randomNames[Math.floor(Math.random() * randomNames.length) + 0]
		apiRequest.searchWorks(n,{operator:apiRequest.ANY})
		.then(function (records) {
			console.log("\t",n,records.length)
			//no idea what will it return, if it doesn't error out that is gooood
			done()
		})
		.fail(function (error) {
			throw error
			done()
		})
	})

	//test the url generator
	it('buildSearchUrl - default', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - ONE_OR_MORE', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.ONE_OR_MORE })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3D+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - EXACT', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.EXACT })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+exact+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - ANY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.ANY })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+any+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - ALL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.ALL })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - LESS', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.LESS })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3C+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - LESS_EQUAL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.LESS_EQUAL })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3C%3D+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - GRATER', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.GRATER })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3E+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - GRATER_EQUAL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.GRATER_EQUAL })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+%3E%3D+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - operators - NOT', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{operator: apiRequest.NOT })
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+not+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})


	//----------

	it('buildSearchUrl - type - searchAny', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchServerChoice', function (done) {
		var r = apiRequest.buildSearchUrl('searchServerChoice','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=cql.serverChoice+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchCorporate', function (done) {
		var r = apiRequest.buildSearchUrl('searchCorporate','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.corporateNames+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchGeographic', function (done) {
		var r = apiRequest.buildSearchUrl('searchGeographic','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.geographicNames+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchLCCN', function (done) {
		var r = apiRequest.buildSearchUrl('searchLCCN','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.LCCN+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchPreferredName', function (done) {
		var r = apiRequest.buildSearchUrl('searchPreferredName','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.mainHeadingEl+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchNames', function (done) {
		var r = apiRequest.buildSearchUrl('searchNames','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.names+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchPersonalNames', function (done) {
		var r = apiRequest.buildSearchUrl('searchPersonalNames','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.personalNames+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchSourceRecord', function (done) {
		var r = apiRequest.buildSearchUrl('searchSourceRecord','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.source+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchTitle', function (done) {
		var r = apiRequest.buildSearchUrl('searchTitle','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.title+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchExpression', function (done) {
		var r = apiRequest.buildSearchUrl('searchExpression','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.uniformTitleExpressions+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})

	it('buildSearchUrl - type - searchWorks', function (done) {
		var r = apiRequest.buildSearchUrl('searchWorks','hithere',{})
		r.should.equal('http://viaf.org/viaf/search?query=local.uniformTitleWorks+all+"hithere"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})



	//source limit

	it('buildSearchUrl - source limit - VAIF', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.VIAF})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"viaf"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - AUSTRALIA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.AUSTRALIA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nla"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - BELGIUM', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.BELGIUM})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"vlacc"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - CANADA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.CANADA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"lac"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - CZECH', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.CZECH})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nkc"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - EGYPT', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.EGYPT})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"egaxa"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - FRANCE_BNF', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.FRANCE_BNF})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bnf"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - FRANCE_SUDOC', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.FRANCE_SUDOC})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"sudoc"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - GERMANY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.GERMANY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"dnb"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - GETTY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.GETTY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"jpg"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - HUNGARY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.HUNGARY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nszl"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - ISRAEL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.ISRAEL})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nliara"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - ITALY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.ITALY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"iccu"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - LOC', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.LOC})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"lc"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - NORWAY', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.NORWAY})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bibsys"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - POLAND', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.POLAND})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"nukat"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - PORTUGAL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.PORTUGAL})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"ptbnp"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SPAIN', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SPAIN})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bne"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SWEDEN', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SWEDEN})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"selibr"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SWISS_NL', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SWISS_NL})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"swnl"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - SWISS_RERO', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.SWISS_RERO})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"rero"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - RUSSIA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.RUSSIA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"rsl"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - VATICAN', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.VATICAN})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"bav"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	

	it('buildSearchUrl - source limit - XA', function (done) {
		var r = apiRequest.buildSearchUrl('searchAny','hithere',{limit : apiRequest.XA})
		r.should.equal('http://viaf.org/viaf/search?query=cql.any+all+"hithere"+and+local.sources+%3D+"xa"&sortKeys=holdingscount&maximumRecords=50&httpAccept=application/xml')
		done()
	})	





})