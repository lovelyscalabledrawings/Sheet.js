// -*- Mode: JavaScript QUnit; tab-width: 4; -*-

if (typeof exports == 'undefined') exports = {};

// Test Requirements

if (typeof require != 'undefined') {
	// If run from the project root
	require.paths.unshift('Source');
	require.paths.unshift('Test');
	
	if (typeof API == 'undefined')
		var API = require("DOM-styleSheet.api");
	
	if (typeof Sheet == 'undefined')
		var Sheet = require("Sheet").Sheet;
}

// Test

exports ["test Property parsing"] = {
  
  "test stuff": function() {
    for (var property in Examples) {
      var examples = Examples[property];
      for (var input in examples) {
        var value = SheetParser.Value.translate(input);
        if (!value.push) value = [value];
        deepEqual(
          SheetParser.Properties[property].apply(1, value),
          examples[input], 
          property + ': ' + input
        )
      }
    }
  }
  
} 


var Examples = { 
  zIndex: {
    '0': true,
    '1': true,
    '999999': true,
    '-1': true,
    '+1': false,
    'f': false,
    'none': false,
    'inherit': false,
    'f99999': false
  },
  display: {
    'block': true,
    'inline-block': true,
    'bkoz': false,
    '-moz-inline-block': false
  },
  color: {
    'rgb(1, 1, 1)': true,
    'rgba(1, 2, 1)': true,
    'rgba(1, 2, 1, 1)': true,
    'rgba(1, 2, 1, 1%)': true,
    'rgba(1, 2, 1, 0.5)': true,
    'hsb(0, 30, 100, 0.5)': true,
    '#ccc': true,
    '#cccccc': true,
    '#ccccc': false,
    'rgbo(1, 2, 1, 0.5)': false,
    'rdb(1, 2, 1, 0.5)': false
    //'black'
    //'cyan'
    
    //'rgbo(1, 2, 1f, 0.5)': false, - arguments not validated yet
    //'rdb(1, z, 1, 0.5)': false,
    
  },
  lineHeight: {
    'normal': true,
    'normol': false,
    '1': true,
    '1.5': true,
    '50%': true,
    '55.4%': true,
    '5f.5%': false,
    'none': false
  },
  cursor: {
    'sw-resize': true,
    'ws-resize': false
  },
  fontWeight: {
    '100': true,
    'bold': true,
    'normal': true,
    '100%': false,
    'big': false
  },
  borderTop: {
    '3px solid #ccc': {borderTopWidth: {number: 3, unit: 'px'}, borderTopStyle: 'solid', borderTopColor: '#ccc'},
    '1em dotted rgba(1,1,1, 0.5)': {borderTopWidth: {number: 1, unit: 'em'}, borderTopStyle: 'dotted', borderTopColor: {rgba: [1, 1, 1, 0.5]}},
    '1.3pt solid hsb(0, 0, 30, 30)': {borderTopWidth: {number: 1.3, unit: 'pt'}, borderTopStyle: 'solid', borderTopColor: {hsb: [0, 0, 30, 30]}},
    
    '1.3% solid hsb(0, 0, 30, 30)': false,    
    '1em soled rgba(1,1,1, 0.5)': false,    
    '1em solid #cccccz': false,
//    '3px solid black': {borderTopWidth: {number: 3, unit: 'px'}, borderTopStyle: 'solid', borderTopColor: 'black'},
  },
  font: {
    '7px Georgia': {fontSize: {number: 7, unit: 'px'}, fontFamily: 'Georgia'},
    'normal 3pt Georgia': {fontStyle: 'normal', fontSize: {number: 3, unit: 'pt'}, fontFamily: 'Georgia'},
    'normal bold medium "Tahoma"': {fontStyle: 'normal', fontWeight: 'bold', fontSize: 'medium', fontFamily: 'Tahoma'},
    'normal italic medium "Tahoma"': {fontVariant: 'normal', fontStyle: 'italic', fontSize: 'medium', fontFamily: 'Tahoma'},
    'bold italic medium "Tahoma"': {fontWeight: 'bold', fontStyle: 'italic', fontSize: 'medium', fontFamily: 'Tahoma'},
    'bold italic small-caps medium "Tahoma"': {fontWeight: 'bold', fontStyle: 'italic', fontVariant: 'small-caps', fontSize: 'medium', fontFamily: 'Tahoma'},
    
    'Georgia 7px': false,
    'Georgia': false,
    '7px': false,
    '3pt normal 3px Tahoma': false,
    '3pz Georgia': false
    //'3pt normal normal Tahoma': false, - fontFamily twice
    //'normal bold medium normal "Tahoma"': {fontStyle: 'normal', fontWeight: 'bold', fontSize: 'medium', lineHeight: 'normal', fontFamily: 'Tahoma'}
  }
}