// The in memeory caching

"use strict"

var apiConfig = require('./apiConfig')

var exports = module.exports = {}


exports.cache = { }

exports.return = function (url) {
	if (exports.cache[url]){
		return exports.cache[url]
	}else{
		return false
	}
}

exports.add = function (url,data,raw) {

	if (!raw) var raw = false
		
	//see if we have this one already
	if (exports.return(url)){
		return false
	}else{

		//don't have it yet we are going to add make sure the cache is ready
		exports.prune()

		//add it
		exports.cache[url] = { data : data, time : Math.floor(Date.now() / 1000), raw: raw  }

	}


}

exports.prune = function (pruneToLength) {


	if (!pruneToLength) var pruneToLength = apiConfig.config.cacheSize


	if (Object.keys(exports.cache).length > pruneToLength){

		for (var x = 0; x = Object.keys(exports.cache).length-pruneToLength; x++){

			var oldTime = 999999999999999999	
			var deleteThisKey = false		
			for (var aKey in exports.cache ){


				if (exports.cache[aKey].time < oldTime ) deleteThisKey = aKey


			}

			delete exports.cache[deleteThisKey]



		}

	}




}