var should = require('should'),
	apiCache = require("../apiCache.js")



describe('apiCache', function () {

	this.timeout(25000);


	it('cache - add', function () {


		apiCache.add('http://viaf.org/viaf/search?query=cql.serverChoice+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml',{value: true})

		apiCache.cache['http://viaf.org/viaf/search?query=cql.serverChoice+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml'].data.value.should.equal(true)

		apiCache.add('http://viaf.org/viaf/search?query=cql.seasdfsdfortKey=holdingscount&maximumRecords=50&httpAccept=application/xml',{value: true})
		apiCache.add('http://viaf.org/viaf/search?query=cql.sasdfasdfRecords=50&httpAccept=application/xml',{value: true})
		apiCache.add('http://viaf.org/viaf/search?qasdfasdfsadfumRecords=50&httpAccept=application/xml',{value: true})
		apiCache.add('http://viaf.org/viaf/search?queasdfsdfsmumRecords=50&httpAccept=application/xml',{value: true})


		Object.keys(apiCache.cache).length.should.equal(5)

	})




	it('cache - prune - config length', function () {
		apiCache.prune()
		Object.keys(apiCache.cache).length.should.equal(5)
	})



	it('cache - prune', function () {
		apiCache.prune(2)
		Object.keys(apiCache.cache).length.should.equal(2)
	})

	it('cache - return', function () {
		var r = apiCache.return('http://viaf.org/viaf/search?query=cql.serverChoice+all+"hithere"&sortKey=holdingscount&maximumRecords=50&httpAccept=application/xml')
		r.data.value.should.equal(true)
	})

	it('cache - return false', function () {
		var r = apiCache.return('http://nonononononononononount&maximumRecords=50&httpAccept=application/xml')

		r.should.equal(false)
	})


	//try 1000 times and the cache should stay in scoped size
	it('cache - add - maintain limit', function () {		
		for (var x = 0; x < 1000; x++){
			apiCache.add(Math.random().toString(36).substring(0), {value: true})
			Object.keys(apiCache.cache).length.should.be.below(102)
		}		
	})



})