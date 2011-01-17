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
        deepEqual(
          SheetParser.Properties[property].apply(1, SheetParser.Value.translate(input)),
          examples[input]
        )        
      }
    }
  }
  
} 


var Examples = { 
  borderTop: {
    '3px solid #ccc': {borderTopWidth: {number: 3, unit: 'px'}, borderTopStyle: 'solid', borderTopColor: '#ccc'},
    '1em dotted rgba(1,1,1, 0.5)': {borderTopWidth: {number: 1, unit: 'em'}, borderTopStyle: 'dotted', borderTopColor: {rgba: [1, 1, 1, 0.5]}},
    '1.3pt solid hsb(0, 0, 30, 30)': {borderTopWidth: {number: 1.3, unit: 'pt'}, borderTopStyle: 'solid', borderTopColor: {hsb: [0, 0, 30, 30]}},
    
    '1.3% solid hsb(0, 0, 30, 30)': false,    
    '1em soled rgba(1,1,1, 0.5)': false,    
    '1em solid #cccccz': false,
//    '3px solid black': {borderTopWidth: {number: 3, unit: 'px'}, borderTopStyle: 'solid', borderTopColor: 'black'},
    
  }  
}