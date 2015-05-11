##VIAF Wrapper

[![Build Status](https://travis-ci.org/thisismattmiller/viaf-wrapper.svg?branch=master)](https://travis-ci.org/thisismattmiller/viaf-wrapper)

A NODE API wrapper for the VIAF.org search and get XML endpoints. A tool for bibliographic [authority control](http://en.wikipedia.org/wiki/Authority_control).


```
npm install viaf-wrapper --save
```

In node:

```
var viaf = require('viaf-wrapper')

viaf.searchPreferredName("Jack Kerouac")
  .then(function(records){

  	for (var x in records){
  		console.log(records[x])
  	}

  })
  .fail(function(error){
  	console.log(error))
  })
```
Callback method is also supported.

On the command line install by installing it globablly:

```
npm install viaf-wrapper -g
```
Command line execute:

```
$ viaf searchPreferredName "Jack Kerouac"
```

You can pipe it into jq for example:

```
$ viaf searchPreferredName "Jack Kerouac" | jq
```
Use viaf --help for all command line options

---

###API

Several search modes are supported by the wrapper:

```
var viaf = require('viaf-wrapper')

//Search All Fields
viaf.searchAny

//The server chooses which index to search using this value
viaf.searchServerChoice

//Corporate names
viaf.searchCorporate

//Geographic names (only jurisdictional names so far)
viaf.searchGeographic

//Search LCCN (Library of Congress Number) headings
viaf.searchLCCN

//Search in preferred name headings
viaf.searchPreferredName

//Search all name headings
viaf.searchNames

//Search all person name headings
viaf.searchPersonalNames

//Search source record
viaf.searchSourceRecord

//Search titles
viaf.searchTitle

//Search uniform titles (Expressions)
viaf.searchExpression

//Search uniform titles (Works)
viaf.searchWorks

```

The following options are supported by passing a object with the request

Operators:

```
//One or more terms
viaf.ONE_OR_MORE

//Exact term
viaf.EXACT

//Any term
viaf.ANY

//All terms listed
viaf.ALL

//Self explanatory
viaf.LESS
viaf.LESS_EQUAL
viaf.GRATER
viaf.GRATER_EQUAL
viaf.NOT
```
viaf.ALL is default operator


For example to search for this exact name heading:

```
var viaf = require('viaf-wrapper')

viaf.searchNames("Kerouac, Jack, 1922-1969.",{operator:viaf.EXACT})
.then(function(records){
	console.log(records.length)
})

> 1
```

You can also limit by original source of the authority records:

```
viaf.VIAF
viaf.AUSTRALIA
viaf.BELGIUM
viaf.CANADA
viaf.CZECH
viaf.EGYPT
viaf.FRANCE_BNF
viaf.FRANCE_SUDOC
viaf.GERMANY
viaf.GETTY
viaf.HUNGARY
viaf.ISRAEL
viaf.ITALY
viaf.LOC
viaf.NORWAY
viaf.POLAND
viaf.PORTUGAL
viaf.SPAIN
viaf.SWEDEN
viaf.SWISS_NL
viaf.SWISS_RERO
viaf.RUSSIA
viaf.VATICAN
viaf.XA
```
To only search the French authoirty records:

```
viaf.searchNames("Kerouac, Jack, 1922-1969.",{operator: viaf.EXACT, limit: viaf.FRANCE_BNF})
.then(function(records){
	console.log(records.length)
})
```


You can also specify what record to start on:

```
{operator: viaf.EXACT, limit: viaf.FRANCE_BNF, start: 11}
```

This is important as VIAF will only return 10 full records at a time. Normally the website interface returns  "BriefVIAF" data layout which does not have the full record. To get more than 10 records you will need to fire another request.


You can also get a record if you know the VIAF id or LCCN with the .getViaf and .getLccn methods:

```
viaf.getViaf('27066713')
.then(function(record){
	console.log(record)
})

viaf.getLccn('n80036674')
.then(function(record){
	console.log(record)
})
```

Here is the full layout of the records type. Search returns an array of these, get returns a single. THe property names follow the XML namespace.

[https://gist.github.com/thisismattmiller/becffc95f9765e72fd94](https://gist.github.com/thisismattmiller/becffc95f9765e72fd94)

Take a look at the data represented here which is all available in the wrapper:
[http://viaf.org/viaf/27066713/](http://viaf.org/viaf/27066713/)








