// -*- Mode: JavaScript QUnit; tab-width: 4; -*-

if (typeof exports == 'undefined') exports = {};

// Test Requirements

if (typeof module !== 'undefined' && module.exports) {
	// If run from the project root
	require.paths.unshift('Source');
	require.paths.unshift('Test');
	
	if (typeof API == 'undefined')
		var API = require("DOM-styleSheet.api");
	
	if (typeof Sheet == 'undefined')
		var Sheet = require("Sheet").Sheet;
}

// Test

exports ["test Value parsing"] = {
  
  "test stuff": function() {
    for (var input in Examples) {
      deepEqual(
        Sheet.Value.translate(input),
        Examples[input],
        input
      )
    }
  }
  
} 


var Examples = { 
  '1': 1,
  '3.5': 3.5,
  '5f.5': '5f.5',
  '"5f.5"': '5f.5',
  '2em': {number: 2, unit: 'em'},
  '3px': {number: 3, unit: 'px'},
  '4pt': {number: 4, unit: 'pt'},
  '5fr': {number: 5, unit: 'fr'},
  '65%': {number: 65, unit: '%'},
  '1 1': [1, 1],
  '1 +1': [1, 1],
  '1 -1': [1, -1],
  '(1 -1)': [1, '-', 1],
  '(1 +1)': [1, '+', 1],
  '(1-1)': [1, '-', 1],
  '(1+1)': [1, '+', 1],
  '(a)': 'a',
  '-(1)': -1,
  '-(1 - 5)': ['-', [1, '-', 5]],
  '+(1 - 5)': ['+', [1, '-', 5]],
  '+(1 - 5)': ['+', [1, '-', 5]],
  '*(1 - 5)': ['*', [1, '-', 5]],
  '-(1 +-5)': ['-', [1, '+', -5]],
  '+(1 +-5)': ['+', [1, '+', -5]],
  '+(1 +-5)': ['+', [1, '+', -5]],
  '*(1 +-5)': ['*', [1, '+', -5]],
  '-(1 -+5)': ['-', [1, '-', 5]],
  '+(1 -+5)': ['+', [1, '-', 5]],
  '+(1 -+5)': ['+', [1, '-', 5]],
  '*(1 -+5)': ['*', [1, '-', 5]],
  '1 1 1': [1, 1, 1],
  '1 1 9 1': [1, 1, 9, 1],
  '1 2 4 8 1': [1, 2, 4, 8, 1],
  '1 1, 1 3': [[1, 1], [1, 3]],
  'a != b': ['a', '!=', 'b'],
  'a ~= b': ['a', '~=', 'b'],
  'not screen and (pixel--moz-density: 3)': ['not', 'screen', {'and': ['pixel--moz-density:', 3]}],
  'count()': {count: []},
  'count(#publications[a=1]::items > li ~ a[href])': {count: ['#publications[a=1]::items', '>', 'li', '~', 'a[href]']},
  'count(#publications[a=1]::items !> li !~ a[href])': {count: ['#publications[a=1]::items', '!>', 'li', '!~', 'a[href]']},
  'count(#publications[a=1]::items ++ li ~~ a[href])': {count: ['#publications[a=1]::items', '+', '+', 'li', '~~', 'a[href]']},
  'a(b)': {a: "b"},
  '(b)': "b",
  '(b a)': ["b", "a"],
  '(b / a + 3)': ["b", "/", "a", "+", 3],
  "(a / (b - 2)(2 - 3)) / 2": [['a', '/', ['b', '-', 2], [2, '-', 3]], '/', 2],
  'url("http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect")': {url: "http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect"},
  'url(\'http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect\')': {url: "http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect"},
  'url(http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect)': {url: "http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect"},
  'local(http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect)': {local: "http://jesus.com.abc/white.xml?q=a[b][]=c&a#perfect"},
  'url(1px solid)': {url: '1px solid'},
  'local(1px solid)': {local: '1px solid'},
  'src(1px solid)': {src: '1px solid'},
  'srk(1px solid)': {srk: [{number: 1, unit: 'px'}, 'solid']},
  'lokal(1px solid)': {lokal: [{number: 1, unit: 'px'}, 'solid']},
  'uzl(1px solid)': {uzl: [{number: 1, unit: 'px'}, 'solid']},
  'rgba(1, 1, 1, 40%)': {rgba: [1, 1, 1, {number: 40, unit: '%'}]},
  //'each(items) { hello() }': {each: ['items', {hello: []}]},
  //'each(items) { hello(), bye() }': {each: ['items', [{hello: []}, {bye: []}]]},
  //'each(items) { hello() + bye() }': {each: ['items', [{hello: []}, '+', {bye: []}]]},
  '1em, 2em 3em, 4em 5em 6em, 7em 9em 3pt auto': [
    [{number: 1, unit: 'em'}], 
    [{number: 2, unit: 'em'}, {number: 3, unit: 'em'}], 
    [{number: 4, unit: 'em'}, {number: 5, unit: 'em'}, {number: 6, unit: 'em'}],
    [{number: 7, unit: 'em'}, {number: 9, unit: 'em'}, {number: 3, unit: 'pt'}, 'auto']],
    
  //edge case in CSS: string separated list
  //two arrays instead of one
  'normal normal 3px/5pt Georgia, "Times New Roman"': [['normal', 'normal', {number: 3, unit: 'px'}, '/', {number: 5, unit: 'pt'}, 'Georgia'], ['Times New Roman']]
}