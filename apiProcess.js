// process responses from the server

"use strict"


var request   = require('request'),
	apiConfig = require('./apiConfig'),
	xml2js = require('xml2js')



var exports = module.exports = {}


//splits the search results into an object
exports.splitSearchResults = function(xml, cb){

	var parser = new xml2js.Parser();


	var resultObj = {

		version : false,
		total: 0,
		records : []


	}


	//normalize the ns# bussiness going on here
	xml = xml.replace(/<ns[0-9]+:/gmi,"<ns2:").replace(/<\/ns[0-9]+:/gmi,"</ns2:")

	//convert the xml
    parser.parseString(xml, function (err, result) {

        if (result['searchRetrieveResponse']){

        	//grab the version
        	if (result['searchRetrieveResponse']['version']){
        		if (result['searchRetrieveResponse']['version'][0]){
        			if (result['searchRetrieveResponse']['version'][0]['_']) resultObj.version = parseFloat(result['searchRetrieveResponse']['version'][0]['_'])
        		}
        	}

        	//grab the total results
        	if (result['searchRetrieveResponse']['numberOfRecords']){
        		if (result['searchRetrieveResponse']['numberOfRecords'][0]){
        			if (result['searchRetrieveResponse']['numberOfRecords'][0]['_']) resultObj.total = parseInt(result['searchRetrieveResponse']['numberOfRecords'][0]['_'])
        		}
        	}

        	//grab the records proper
        	if (result['searchRetrieveResponse']['records']){
        		if (result['searchRetrieveResponse']['records'][0]){
        			if (result['searchRetrieveResponse']['records'][0]['record']){
        				resultObj.records = result['searchRetrieveResponse']['records'][0]['record']
        			}
        		}
        	}
        	

        }

        if (cb) cb(resultObj)

    });


}


exports.combineResults = function(record){


	var results = {}


	var arrayMethods = []

	var objMethods = ["recordBasic","recordMainHeading","recordFixed","recordDates"]
	var arrayMethods = ["recordSources","recordX400","recordX500","recordCoAuthors","recordPublishers","recordRecFormats","recordRelatorCodes","recordISBNs","recordCovers","recordCountries","recordLanguageOfEntity","recordNationalityOfEntity","recordxLinks","recordTitles","recordHistory"]

	for (var x in objMethods){
		var r = exports[objMethods[x]](record)
		for (var rKey in r){
			results[rKey] = r[rKey]
		}
	}
	for (var x in arrayMethods){
		var r = exports[arrayMethods[x]](record)		
		if (r.length==0) r = false

		//make the key based on the xml namespace
		var newKey = arrayMethods[x].replace("record",'')		
		newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);

		results[newKey] = r
	}

	//enrich some things like nationality and language
	var count = 0
	if (results.titles){
		for (var t in results.titles){
			t = results.titles[t]
			if (t.sources.length > count) {
				results.titlesTop = t
				count = t.sources.length
			}
		}
	}else{
		results.titlesTop = false
	}

	count = 0
	if (results.nationalityOfEntity){
		for (var t in results.nationalityOfEntity){
			t = results.nationalityOfEntity[t]
			if (t.sources.length > count) {
				results.nationalityOfEntityTop = t.text
				count = t.sources.length
			}
		}
	}else{
		results.nationalityOfEntityTop = false
	}

	count = 0
	if (results.languageOfEntity){
		for (var t in results.languageOfEntity){
			t = results.languageOfEntity[t]
			if (t.sources.length > count) {
				results.languageOfEntityTop = t.text
				count = t.sources.length
			}
		}
	}else{
		results.languageOfEntityTop = false
	}

	return results





}


















//retrive the high level elements
// http://viaf.org/viaf/terms#viafID
// http://viaf.org/viaf/terms#nameType
// http://viaf.org/viaf/terms#Document
// http://viaf.org/viaf/terms#length
// http://viaf.org/viaf/terms#birthDate
// http://viaf.org/viaf/terms#deathDate
// http://viaf.org/viaf/terms#dateType
exports.recordBasic = function(record){

	function resultObj(){

		this.viafId = false
		this.nameType = false
		this.primaryTopic = false
		this.recordLength = false
		this.birthDate = false
		this.deathDate = false
		this.dateType = false

	}

	resultObj = new resultObj()

	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]

					if (data['ns2:viafID']) resultObj.viafId = data['ns2:viafID'].toString()

					if (data['ns2:Document']){
						if (data['ns2:Document'][0]){						
							if (data['ns2:Document'][0]['ns2:primaryTopic']){
								if (data['ns2:Document'][0]['ns2:primaryTopic'][0]){
									if (data['ns2:Document'][0]['ns2:primaryTopic'][0]['$']){
										if (data['ns2:Document'][0]['ns2:primaryTopic'][0]['$']['resource'])  resultObj.primaryTopic = data['ns2:Document'][0]['ns2:primaryTopic'][0]['$']['resource']
									}
								}
							}
						}
					}

					if (data['ns2:nameType']) resultObj.nameType = data['ns2:nameType'].toString()
					if (data['ns2:length']) resultObj.recordLength = parseInt(data['ns2:length'].toString())
					if (data['ns2:birthDate']) resultObj.birthDate = data['ns2:birthDate'].toString()
					if (data['ns2:deathDate']) resultObj.deathDate = data['ns2:deathDate'].toString()
					if (data['ns2:dateType']) resultObj.dateType = data['ns2:dateType'].toString()

				} 

			}

		}

	}

	return resultObj


}

//retrive the sources elements
// http://viaf.org/viaf/terms#sources
exports.recordSources = function(record){

	//what gets returned
	var resultAry = []

	//elements of what each one has
	function resultObj(){

		this.nsid = false
		this.source = false
		this.value = false
		this.differentiated = true	//default is to be differentiated 
		this.sparse = false
	}


	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:sources']){
						if (data['ns2:sources'][0]){						
							if (data['ns2:sources'][0]){								
								if (data['ns2:sources'][0]['ns2:source']){									
									var sources = data['ns2:sources'][0]['ns2:source']

									for (var aSource in sources){

										//make a fresh object
										var aResult = new resultObj()

										aSource = sources[aSource]

										if (aSource['_']){
											aResult.value = aSource['_'].toString()
											aResult.source = aSource['_'].toString().split("|")[0]
										}

										if (aSource['$']){
											if (aSource['$']['nsid']) aResult.nsid = aSource['$']['nsid']
											if (aSource['$']['differentiated']) aResult.differentiated = JSON.parse(aSource['$']['differentiated'].toString().toLowerCase())
											if (aSource['$']['sparse']) aResult.sparse = JSON.parse(aSource['$']['sparse'].toString().toLowerCase())
										} 
										resultAry.push(aResult)
									}								
								}
							}
						}
					}

				} 

			}

		}

	}


	return resultAry


}



//retrive the sources elements
// http://viaf.org/viaf/terms#mainHeadings
exports.recordMainHeading = function(record){


	//elements of what each one has
	function resultObj(){

		this.mainHeadingsData = []
		this.heading = false
		this.mainHeadingEls = []
	}

	function resultObjMainHeading(){
		this.text = false
		this.source = []
	}

	function resultObjMainHeadingEl(){
		this.dtype = false
		this.ind1 = false
		this.ind2 = false
		this.tag = false
		this.source = false
		this.id = false

		//there could be infinity subfields defined so we cannot know for sure what will be there
		// this.a = false......
	}

	var resultObj = new resultObj

	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]

					if (data['ns2:mainHeadings']){

						if (data['ns2:mainHeadings'][0]){


							if (data['ns2:mainHeadings'][0]['ns2:data']){

								var headingData = []

								for (var aHeading in data['ns2:mainHeadings'][0]['ns2:data']){


									aHeading = data['ns2:mainHeadings'][0]['ns2:data'][aHeading]

									var aHeadingData = new resultObjMainHeading()

									if (aHeading['ns2:text']){
										if (aHeading['ns2:text'][0]){
											aHeadingData.text = aHeading['ns2:text'][0].toString()
										}
									}

									if (aHeading['ns2:sources']){
										if (aHeading['ns2:sources'][0]){
											if (aHeading['ns2:sources'][0]['ns2:s']) aHeadingData.source = aHeading['ns2:sources'][0]['ns2:s']
										}
									}

									headingData.push(aHeadingData)

								}
							}

							resultObj.mainHeadingsData = headingData

							//enrich with top heading with the most used heading
							var headingLen = 0
							for (var x in headingData){
								if (headingData[x].source.length>headingLen){
									headingLen = headingData[x].source.length
									resultObj.heading = headingData[x].text
								}

							}

							//do the marc fields and matching fields
							if (data['ns2:mainHeadings'][0]['ns2:mainHeadingEl']){


								for (var aMainHeadingEl in data['ns2:mainHeadings'][0]['ns2:mainHeadingEl']){
									aMainHeadingEl = data['ns2:mainHeadings'][0]['ns2:mainHeadingEl'][aMainHeadingEl]
									
									var aResultObjMainHeadingEl = new resultObjMainHeadingEl()

									if (aMainHeadingEl['ns2:datafield']){
										if (aMainHeadingEl['ns2:datafield'][0]){

											if (aMainHeadingEl['ns2:datafield'][0]['$']){

												if (aMainHeadingEl['ns2:datafield'][0]['$']['dtype']) aResultObjMainHeadingEl.dtype = aMainHeadingEl['ns2:datafield'][0]['$']['dtype']
												if (aMainHeadingEl['ns2:datafield'][0]['$']['ind1']) aResultObjMainHeadingEl.ind1 = aMainHeadingEl['ns2:datafield'][0]['$']['ind1']
												if (aMainHeadingEl['ns2:datafield'][0]['$']['ind2']) aResultObjMainHeadingEl.ind2 = aMainHeadingEl['ns2:datafield'][0]['$']['ind2']
												if (aMainHeadingEl['ns2:datafield'][0]['$']['tag']) aResultObjMainHeadingEl.tag = aMainHeadingEl['ns2:datafield'][0]['$']['tag']


											}

											//not supporting repeatable fields here
											if (aMainHeadingEl['ns2:datafield'][0]['ns2:subfield']){

												for (var aSubField in aMainHeadingEl['ns2:datafield'][0]['ns2:subfield']){

													aSubField = aMainHeadingEl['ns2:datafield'][0]['ns2:subfield'][aSubField]

													if (aSubField['$']){
														if (aSubField['$']['code']){
															if (aSubField['_']) aResultObjMainHeadingEl[aSubField['$']['code']] = aSubField['_']
														}
													}
												}

											}										
										}
									}

									if (aMainHeadingEl['ns2:id']){
										aResultObjMainHeadingEl.id = aMainHeadingEl['ns2:id'].toString()

										aResultObjMainHeadingEl.source = aMainHeadingEl['ns2:id'].toString().split("|")[0]
									}

									//TODO: the ns2:link and ns2:match fields

									resultObj.mainHeadingEls.push(aResultObjMainHeadingEl)
								}

							}

						}

					}


				}

			}

		}

	}



	return resultObj

}

// http://viaf.org/viaf/terms#fixed
exports.recordFixed = function(record){

	function resultObj(){

		//what else in here....dunno
		this.gender = false

	}

	resultObj = new resultObj()

	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]

					if (data['ns2:fixed']){
						if (data['ns2:fixed'][0]){		


							if (data['ns2:fixed'][0]['ns2:gender']) resultObj.gender = data['ns2:fixed'][0]['ns2:gender'].toString()


						}
					}

				} 

			}

		}

	}

	return resultObj


}




//retrive the 400s elements
// http://viaf.org/viaf/terms#x400s
exports.recordX400 = function(record){

	//what gets returned
	var resultAry = []

	function resultObj(){

		this.dtype = false
		this.ind1 = false
		this.ind2 = false
		this.tag = false
		this.normalized = false
		this.sources = false

		//there could be infinity subfields defined so we cannot know for sure what will be there
		// this.a = false......
	}




	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]

					if (data['ns2:x400s']){

						if (data['ns2:x400s'][0]){


							if (data['ns2:x400s'][0]['ns2:x400']){


								for (var a400 in data['ns2:x400s'][0]['ns2:x400']){

									var a400Data = new resultObj

									a400 = data['ns2:x400s'][0]['ns2:x400'][a400]


									if (a400['ns2:sources']){
										if (a400['ns2:sources'][0]){
											a400Data.sources = a400['ns2:sources'][0]['ns2:s']
										}
									}

									if (a400['ns2:datafield']){
										if (a400['ns2:datafield'][0]){
											if (a400['ns2:datafield'][0]['$']){
												if (a400['ns2:datafield'][0]['$']['dtype']) a400Data.dtype = a400['ns2:datafield'][0]['$']['dtype']
												if (a400['ns2:datafield'][0]['$']['ind1']) a400Data.ind1 = a400['ns2:datafield'][0]['$']['ind1']
												if (a400['ns2:datafield'][0]['$']['ind2']) a400Data.ind2 = a400['ns2:datafield'][0]['$']['ind2']
												if (a400['ns2:datafield'][0]['$']['tag']) a400Data.tag = a400['ns2:datafield'][0]['$']['tag']
											}

											//not supporting repeatable fields here
											if (a400['ns2:datafield'][0]['ns2:subfield']){

												for (var aSubField in a400['ns2:datafield'][0]['ns2:subfield']){

													aSubField = a400['ns2:datafield'][0]['ns2:subfield'][aSubField]

													if (aSubField['$']){
														if (aSubField['$']['code']){
															if (aSubField['_']) a400Data[aSubField['$']['code']] = aSubField['_']
														}
													}
												}

											}	


											if (a400['ns2:datafield'][0]['ns2:normalized']) a400Data.normalized = a400['ns2:datafield'][0]['ns2:normalized'].toString()



										}


										resultAry.push(a400Data)


									}


								}



							}
						}

					}

				}

			}

		}

	}



	return resultAry


}




//retrive the 500s elements
// http://viaf.org/viaf/terms#x500s
exports.recordX500 = function(record){

	//what gets returned
	var resultAry = []

	function resultObj(){

		this.dtype = false
		this.ind1 = false
		this.ind2 = false
		this.tag = false
		this.normalized = false
		this.sources = false
		this.viafLink = false

		//there could be infinity subfields defined so we cannot know for sure what will be there
		// this.a = false......
	}




	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]

					if (data['ns2:x500s']){

						if (data['ns2:x500s'][0]){


							if (data['ns2:x500s'][0]['ns2:x500']){


								for (var a500 in data['ns2:x500s'][0]['ns2:x500']){

									var a500Data = new resultObj

									a500 = data['ns2:x500s'][0]['ns2:x500'][a500]

									if (a500['$']){
										if (a500['$']['viafLink']){

											a500Data.viafLink = a500['$']['viafLink']
										}										
									}


									if (a500['ns2:sources']){
										if (a500['ns2:sources'][0]){
											a500Data.sources = a500['ns2:sources'][0]['ns2:s']
										}
									}

									if (a500['ns2:datafield']){
										if (a500['ns2:datafield'][0]){
											if (a500['ns2:datafield'][0]['$']){
												if (a500['ns2:datafield'][0]['$']['dtype']) a500Data.dtype = a500['ns2:datafield'][0]['$']['dtype']
												if (a500['ns2:datafield'][0]['$']['ind1']) a500Data.ind1 = a500['ns2:datafield'][0]['$']['ind1']
												if (a500['ns2:datafield'][0]['$']['ind2']) a500Data.ind2 = a500['ns2:datafield'][0]['$']['ind2']
												if (a500['ns2:datafield'][0]['$']['tag']) a500Data.tag = a500['ns2:datafield'][0]['$']['tag']
											}

											//not supporting repeatable fields here
											if (a500['ns2:datafield'][0]['ns2:subfield']){

												for (var aSubField in a500['ns2:datafield'][0]['ns2:subfield']){

													aSubField = a500['ns2:datafield'][0]['ns2:subfield'][aSubField]

													if (aSubField['$']){
														if (aSubField['$']['code']){
															if (aSubField['_']) a500Data[aSubField['$']['code']] = aSubField['_']
														}
													}
												}

											}	


											if (a500['ns2:datafield'][0]['ns2:normalized']) a500Data.normalized = a500['ns2:datafield'][0]['ns2:normalized'].toString()



										}

										resultAry.push(a500Data)

									}


								}



							}
						}

					}

				}

			}

		}

	}



	return resultAry


}


// http://viaf.org/viaf/terms#coauthors
exports.recordCoAuthors = function(record){

	function resultObj(){

		this.count = false
		this.sources = false
		this.tag = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:coauthors']){
						if (data['ns2:coauthors'][0]){	



							if (data['ns2:coauthors'][0]['ns2:data']){

								for (var aData in data['ns2:coauthors'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:coauthors'][0]['ns2:data'][aData]


									if (aData['$']){
										if (aData['$']['count']) aResultObj.count = parseInt(aData['$']['count'])
										if (aData['$']['tag']) aResultObj.tag = aData['$']['tag']
									}

									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}

// http://viaf.org/viaf/terms#publishers
exports.recordPublishers = function(record){

	function resultObj(){

		this.count = false
		this.sources = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:publishers']){
						if (data['ns2:publishers'][0]){	



							if (data['ns2:publishers'][0]['ns2:data']){

								for (var aData in data['ns2:publishers'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:publishers'][0]['ns2:data'][aData]


									if (aData['$']){
										if (aData['$']['count']) aResultObj.count = parseInt(aData['$']['count'])
										if (aData['$']['tag']) aResultObj.tag = aData['$']['tag']
									}

									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}



// http://viaf.org/viaf/terms#dates
exports.recordDates = function(record){

	function resultObj(){
		this.max = false
		this.min = false

		//then each decade will be a key
		//this.2013 = { count : 1234, scaled : 1.55}

	}

	var aResultObj = new resultObj()

	

	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]

					if (data['ns2:dates']){
						if (data['ns2:dates'][0]){	

							if (data['ns2:dates'][0]['$']){
								if (data['ns2:dates'][0]['$']['max']) aResultObj.max = parseInt(data['ns2:dates'][0]['$']['max'])
								if (data['ns2:dates'][0]['$']['min']) aResultObj.min = parseInt(data['ns2:dates'][0]['$']['min'])						
							}

							if (data['ns2:dates'][0]['ns2:date']){

								for (var aDecade in data['ns2:dates'][0]['ns2:date']){

									aDecade = data['ns2:dates'][0]['ns2:date'][aDecade]


									if (aDecade['_']){
										//its like "195" + "0" = "1950"
										aResultObj[aDecade['_']+'0'] = { count: false, scaled : false }

										if (aDecade['$']){

											if (aDecade['$']['count']) aResultObj[aDecade['_']+'0'].count = parseInt(aDecade['$']['count']) 
											if (aDecade['$']['scaled']) aResultObj[aDecade['_']+'0'].scaled = parseFloat(aDecade['$']['scaled']) 

										}


									}


								}

							}





						}
					}






				} 

			}

		}

	}

	return { dates : aResultObj}

}


// http://viaf.org/viaf/terms#RecFormats
exports.recordRecFormats = function(record){

	function resultObj(){

		this.count = false
		this.sources = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:RecFormats']){
						if (data['ns2:RecFormats'][0]){	



							if (data['ns2:RecFormats'][0]['ns2:data']){

								for (var aData in data['ns2:RecFormats'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:RecFormats'][0]['ns2:data'][aData]


									if (aData['$']){
										if (aData['$']['count']) aResultObj.count = parseInt(aData['$']['count'])
										if (aData['$']['tag']) aResultObj.tag = aData['$']['tag']
									}

									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}




// http://viaf.org/viaf/terms#RelatorCodes
exports.recordRelatorCodes = function(record){

	function resultObj(){

		this.count = false
		this.sources = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:RelatorCodes']){
						if (data['ns2:RelatorCodes'][0]){	



							if (data['ns2:RelatorCodes'][0]['ns2:data']){

								for (var aData in data['ns2:RelatorCodes'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:RelatorCodes'][0]['ns2:data'][aData]


									if (aData['$']){
										if (aData['$']['count']) aResultObj.count = parseInt(aData['$']['count'])
										if (aData['$']['tag']) aResultObj.tag = aData['$']['tag']
									}

									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}



// http://viaf.org/viaf/terms#RelatorCodes
exports.recordISBNs = function(record){

	function resultObj(){

		this.count = false
		this.sources = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:ISBNs']){
						if (data['ns2:ISBNs'][0]){	



							if (data['ns2:ISBNs'][0]['ns2:data']){

								for (var aData in data['ns2:ISBNs'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:ISBNs'][0]['ns2:data'][aData]


									if (aData['$']){
										if (aData['$']['count']) aResultObj.count = parseInt(aData['$']['count'])
										if (aData['$']['tag']) aResultObj.tag = aData['$']['tag']
									}

									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}



// http://viaf.org/viaf/terms#RelatorCodes
exports.recordCovers = function(record){

	function resultObj(){

		this.count = false
		this.sources = false
		this.text = false
		this.xText = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:covers']){
						if (data['ns2:covers'][0]){	



							if (data['ns2:covers'][0]['ns2:data']){

								for (var aData in data['ns2:covers'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:covers'][0]['ns2:data'][aData]


									if (aData['$']){
										if (aData['$']['count']) aResultObj.count = parseInt(aData['$']['count'])
										if (aData['$']['tag']) aResultObj.tag = aData['$']['tag']
									}

									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:xtext']){
										if (aData['ns2:xtext'][0]) aResultObj.xText = aData['ns2:xtext'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}

// http://viaf.org/viaf/terms#countries
exports.recordCountries = function(record){

	function resultObj(){

		this.count = false
		this.sources = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:countries']){
						if (data['ns2:countries'][0]){	



							if (data['ns2:countries'][0]['ns2:data']){

								for (var aData in data['ns2:countries'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:countries'][0]['ns2:data'][aData]


									if (aData['$']){
										if (aData['$']['count']) aResultObj.count = parseInt(aData['$']['count'])
										if (aData['$']['scaled']) aResultObj.scaled = parseInt(aData['$']['scaled'])
									}

									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}

// http://viaf.org/viaf/terms#languageOfEntity
exports.recordLanguageOfEntity = function(record){

	function resultObj(){

		this.sources = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:languageOfEntity']){
						if (data['ns2:languageOfEntity'][0]){	



							if (data['ns2:languageOfEntity'][0]['ns2:data']){

								for (var aData in data['ns2:languageOfEntity'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:languageOfEntity'][0]['ns2:data'][aData]


									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}



// http://viaf.org/viaf/terms#nationalityOfEntity
exports.recordNationalityOfEntity = function(record){

	function resultObj(){

		this.sources = false
		this.text = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:nationalityOfEntity']){
						if (data['ns2:nationalityOfEntity'][0]){	



							if (data['ns2:nationalityOfEntity'][0]['ns2:data']){

								for (var aData in data['ns2:nationalityOfEntity'][0]['ns2:data']){

									var aResultObj = new resultObj()

									aData = data['ns2:nationalityOfEntity'][0]['ns2:data'][aData]


									if (aData['ns2:text']){
										if (aData['ns2:text'][0]) aResultObj.text = aData['ns2:text'][0]
									}

									if (aData['ns2:sources']){
										if (aData['ns2:sources'][0]){
											if (aData['ns2:sources'][0]['ns2:s']) aResultObj.sources = aData['ns2:sources'][0]['ns2:s']
										}
									}


									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}


// http://viaf.org/viaf/terms#nationalityOfEntity
exports.recordxLinks = function(record){

	function resultObj(){

		this.type = false
		this.link = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:xLinks']){
						if (data['ns2:xLinks'][0]){	

							if (data['ns2:xLinks'][0]['ns2:xLink']){

								for (var aLink in data['ns2:xLinks'][0]['ns2:xLink']){

									var aResultObj = new resultObj()

									aLink = data['ns2:xLinks'][0]['ns2:xLink'][aLink]


									if (aLink['_']) aResultObj.link = aLink['_']
									
									if (aLink['$']){
										if (aLink['$']['type']) aResultObj.type = aLink['$']['type']	
									} 

									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}

// http://viaf.org/viaf/terms#titles
exports.recordTitles = function(record){

	function resultObj(){

		this.sources = false
		this.title = false
		this.id = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:titles']){
						if (data['ns2:titles'][0]){	



							if (data['ns2:titles'][0]['ns2:work']){


								for (var aWork in data['ns2:titles'][0]['ns2:work']){

									var aResultObj = new resultObj()

									aWork = data['ns2:titles'][0]['ns2:work'][aWork]

									if (aWork['$']){
										if (aWork['$']['id']) aResultObj.id = aWork['$']['id']
									}

									if (aWork['ns2:title']){
										if (aWork['ns2:title'][0]) aResultObj.title = aWork['ns2:title'][0]
									}

									if (aWork['ns2:sources']){
										if (aWork['ns2:sources'][0]){
											if (aWork['ns2:sources'][0]['ns2:s']) aResultObj.sources = aWork['ns2:sources'][0]['ns2:s']
										}
									}

									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}




// http://viaf.org/viaf/terms#history
exports.recordHistory = function(record){

	function resultObj(){

		this.recid = false
		this.time = false
		this.type = false


	}

	var resultAry = []



	if (record.recordData){
		
		if (record.recordData[0]){

			if (record.recordData[0]['ns2:VIAFCluster']){

				if (record.recordData[0]['ns2:VIAFCluster'][0]){

					//shorten the path a litle
					var data = record.recordData[0]['ns2:VIAFCluster'][0]


					if (data['ns2:history']){
						if (data['ns2:history'][0]){	

							if (data['ns2:history'][0]['ns2:ht']){

								for (var aLink in data['ns2:history'][0]['ns2:ht']){

									var aResultObj = new resultObj()

									aLink = data['ns2:history'][0]['ns2:ht'][aLink]

									
									if (aLink['$']){
										if (aLink['$']['recid']) aResultObj.recid = aLink['$']['recid']	
										if (aLink['$']['time']) aResultObj.time = aLink['$']['time']	
										if (aLink['$']['type']) aResultObj.type = aLink['$']['type']
									} 

									resultAry.push(aResultObj)

								}



							}
							

						}
					}

				} 

			}

		}

	}

	return resultAry


}
