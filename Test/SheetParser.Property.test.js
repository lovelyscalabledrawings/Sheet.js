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
Sheet.Value.translate('url(abc)')
// Test

exports ["test Property parsing"] = {
  
  "test stuff": function() {
    for (var property in Examples) {
      var examples = Examples[property];
      for (var input in examples) {
        var value = Sheet.Value.translate(input);
        if (!value.push) value = [value];
        deepEqual(
          Sheet.Styles[property].apply(null, value),
          examples[input], 
          property + ': ' + input
        )
      }
    }
  }
  
} 
var Type = Sheet.Type;


var Examples = { 
  zIndex: {
    '0': 0,
    '1': 1,
    '999999': 999999,
    '-1': -1,
    '+1': 1,
    'f': false,
    'none': false,
    'inherit': false,
    'f99999': false
  },
  display: {
    'block': 'block',
    'inline-block': 'inline-block',
    'bkoz': false,
    '-moz-inline-block': false
  },
  color: {
    'rgb(1, 1, 1)': Type.color([1, 1, 1]),
    'rgba(1, 2, 1)': Type.color([1, 2, 1]),
    'rgba(1, 2, 1, 1)': Type.color([1, 2, 1, 1]),
    'rgba(1, 2, 1, 1%)': Type.color([1, 2, 1, 0.01]),
    'rgba(1, 2, 1, 0.5)': Type.color([1, 2, 1, 0.5]),
    'hsb(0, 30, 100, 0.5)': Type.color([0, 30, 100, 0.5], 'hsb'),
    '#ccc': Type.color('#ccc'),
    '#cccccc': Type.color('#cccccc'),
    '#ccccc': false,
    'rgbo(1, 2, 1, 0.5)': false,
    'rdb(1, 2, 1, 0.5)': false
    //'black'
    //'cyan' - Color map takes 4kb. Does it worth it?    
  },
  lineHeight: {
    'normal': 'normal',
    'normol': false,
    '1': 1,
    '1.5': 1.5,
    '50%': Type.length(50, '%'),
    '55.4%': Type.length(55.4, '%'),
    '5f.5%': false,
    'none': false
  },
  cursor: {
    'sw-resize': 'sw-resize',
    'ws-resize': false
  },
  fontWeight: {
    '100': 100,
    'bold': 'bold',
    'normal': 'normal',
    '100%': false,
    'big': false
  },
  borderTop: {
    '3px solid #ccc': {borderTopWidth: Type.length(3, 'px'), borderTopStyle: 'solid', borderTopColor: Type.color('#ccc')},
    '1em dotted rgba(1,1,1, 0.5)': {borderTopWidth: Type.length({number: 1, unit: 'em'}), borderTopStyle: 'dotted', borderTopColor: Type.color({rgba: [1, 1, 1, 0.5]})},
    '1.3pt solid hsb(0, 0, 30, 30)': {borderTopWidth: Type.length({number: 1.3, unit: 'pt'}), borderTopStyle: 'solid', borderTopColor: Type.color({hsb: [0, 0, 30, 30]})},
    
    '1.3% solid hsb(0, 0, 30, 30)': false,    
    '1em soled rgba(1,1,1, 0.5)': false,    
    '1em solid #cccccz': false,   
    //'1 solid #ccc': false,    //unitless length is valid now
//    '3px solid black': {borderTopWidth: Type.length(3, 'px'), borderTopStyle: 'solid', borderTopColor: 'black'},
  },
  font: {
    '7px Georgia': {fontSize: Type.length(7, 'px'), fontFamily: 'Georgia'},
    'normal 3pt Georgia': {fontStyle: 'normal', fontSize: Type.length(3, 'pt'), fontFamily: 'Georgia'},
    'normal bold medium "Tahoma"': {fontStyle: 'normal', fontWeight: 'bold', fontSize: 'medium', fontFamily: 'Tahoma'},
    'normal italic medium "Tahoma"': {fontVariant: 'normal', fontStyle: 'italic', fontSize: 'medium', fontFamily: 'Tahoma'},
    'bold italic medium "Tahoma"': {fontWeight: 'bold', fontStyle: 'italic', fontSize: 'medium', fontFamily: 'Tahoma'},
    //'bold italic medium 3px "Tahoma"': {fontWeight: 'bold', fontStyle: 'italic', fontSize: 'medium', fontFamily: 'Tahoma'},
    'bold italic small-caps medium "Tahoma"': {fontWeight: 'bold', fontStyle: 'italic', fontVariant: 'small-caps', fontSize: 'medium', fontFamily: 'Tahoma'},
    
    'Georgia 7px': false,
    'Georgia': false,
    '7px': false,
    '3pt normal 3px Tahoma': false,
    '3pz Georgia': false,
    //'3pt normal normal Tahoma': false,
    'normal normal normal Tahoma': false
    //'normal bold medium normal "Tahoma"': {fontStyle: 'normal', fontWeight: 'bold', fontSize: 'medium', lineHeight: 'normal', fontFamily: 'Tahoma'}
  },
  
  margin: {
    '4px': {marginTop: Type.length(4, 'px'), marginRight: Type.length(4, 'px'), marginBottom: Type.length(4, 'px'), marginLeft: Type.length(4, 'px')},
    '50% 4px': {marginTop: Type.length(50, '%'), marginRight: Type.length(4, 'px'), marginBottom: Type.length(50, '%'), marginLeft: Type.length(4, 'px')},
    '4px 4px 4px': {marginTop: Type.length(4, 'px'), marginRight: Type.length(4, 'px'), marginBottom: Type.length(4, 'px'), marginLeft: Type.length(4, 'px')},
    '4px -4fr 4px 4px': {marginTop: Type.length(4, 'px'), marginRight: Type.length(-4, 'fr'), marginBottom: Type.length(4, 'px'), marginLeft: Type.length(4, 'px')},

  },
  
  border: {
    '1px solid #ccc': {
      borderTopWidth: Type.length({number: 1, unit: 'px'}), 
      borderTopStyle: 'solid', 
      borderTopColor: Type.color("#ccc"),
      borderRightWidth: Type.length({number: 1, unit: 'px'}), 
      borderRightStyle: 'solid', 
      borderRightColor: Type.color("#ccc"),
      borderBottomWidth: Type.length({number: 1, unit: 'px'}), 
      borderBottomStyle: 'solid', 
      borderBottomColor: Type.color("#ccc"),
      borderLeftWidth: Type.length({number: 1, unit: 'px'}), 
      borderLeftStyle: 'solid', 
      borderLeftColor: Type.color("#ccc")
    },
    '2pt dotted rgba(0, 10, 37, 50%), 5px dashed #c31': {
      borderTopWidth: Type.length(2, 'pt'), 
      borderTopStyle: 'dotted', 
      borderTopColor: Type.color({rgba: [0, 10, 37, 0.5]}),
      borderRightWidth: Type.length(5, 'px'), 
      borderRightStyle: 'dashed', 
      borderRightColor: Type.color("#c31"),
      borderBottomWidth: Type.length(2, 'pt'), 
      borderBottomStyle: 'dotted', 
      borderBottomColor: Type.color({rgba: [0, 10, 37, 0.5]}),
      borderLeftWidth: Type.length(5, 'px'), 
      borderLeftStyle: 'dashed', 
      borderLeftColor: Type.color("#c31")
    },
    '1px solid #ccc, 2px solid #ccc, 3px solid #ccc': {
      borderTopWidth: Type.length(1, 'px'), 
      borderTopStyle: 'solid', 
      borderTopColor: Type.color("#ccc"),
      borderRightWidth: Type.length(2, 'px'), 
      borderRightStyle: 'solid', 
      borderRightColor: Type.color("#ccc"),
      borderBottomWidth: Type.length(3, 'px'), 
      borderBottomStyle: 'solid', 
      borderBottomColor: Type.color("#ccc"),
      borderLeftWidth: Type.length(2, 'px'), 
      borderLeftStyle: 'solid', 
      borderLeftColor: Type.color("#ccc")
    },
  },
  
  background: {
    '#cc0': { 
      backgroundColor: Type.color('#cc0')
    },
    'no-repeat #cd1': { 
      backgroundRepeat: 'no-repeat', 
      backgroundColor: Type.color('#cd1')
    },
    '#cd2 repeat-x fixed': { 
      backgroundColor: Type.color('#cd2'),
      backgroundRepeat: 'repeat-x',
      backgroundAttachment: 'fixed'
    },
    '#e33 url("http://google.png") center': { 
      backgroundColor: Type.color('#e33'), 
      backgroundImage: new Type.url("http://google.png"), 
      backgroundPositionX: 'center'
    },
    'url("//cc.cc") rgba(0, 3, 2, 1.5%) 3px': {
      backgroundImage: Type.url({url: "//cc.cc"}), 
      backgroundColor: Type.color([0, 3, 2, 0.015]), 
      backgroundPositionX: Type.length(3, 'px')
    },
    '-55.5% right repeat url("//cc.cc#ach.gif") hsb(20, 10, -10, 5%)': { 
      backgroundPositionY: Type.length(-55.5, '%'),
      backgroundPositionX: 'right',
      backgroundRepeat: 'repeat',
      backgroundImage: new Type.url("//cc.cc#ach.gif"), 
      backgroundColor: Type.color({hsb: [20, 10, -10, 0.05]})
    },
    
    '-55.5% bottom repeat-y url("#pic") #ccc fixed': {
      backgroundPositionX: Type.length(-55.5, '%'),
      backgroundPositionY: 'bottom',
      backgroundRepeat: 'repeat-y',
      backgroundImage: new Type.url("#pic"),
      backgroundColor: Type.color('#ccc'),
      backgroundAttachment: 'fixed'
    },
    '-55.5f bottom repeat-y url("#pic") #ccc fixed': false,
    '-55.5% bodtom repeat-y url("#pic") #ccc fixed': false,
    '-55.5% bottom repead-y url("#pic") #ccc fixed': false,
    '-55.5% bottom repeat-y uzl("#pic") #ccc fixed': false,
    '-55.5% bottom repeat-y url #ccc fixed': false,
    '-55.5% bottom repeat-y url("#pic") #zzz fixed': false,
    '-55.5% bottom repeat-y url("#pic") #ccc fixes': false,
    '-55.5% bottom repeat-y url("#pic") #ccc fixed fixed': false
  },
  
  padding: {
    '4pt': {paddingTop: Type.length(4, 'pt'), paddingRight: Type.length(4, 'pt'), paddingBottom: Type.length(4, 'pt'), paddingLeft: Type.length(4, 'pt')},
    '4px 4px': {paddingTop: Type.length(4, 'px'), paddingRight: Type.length(4, 'px'), paddingBottom: Type.length(4, 'px'), paddingLeft: Type.length(4, 'px')},
    '4px 1pt 4px': {paddingTop: Type.length(4, 'px'), paddingRight: Type.length(1, 'pt'), paddingBottom: Type.length(4, 'px'), paddingLeft: Type.length(1, 'pt')},
    '4px 4px 4px 4px': {paddingTop: Type.length(4, 'px'), paddingRight: Type.length(4, 'px'), paddingBottom: Type.length(4, 'px'), paddingLeft: Type.length(4, 'px')},    
    
    '4pz 4px 4px 4px': false,
    '4px 4pz 4px 4px': false,
    '4px 4px 4pz 4px': false,
    '4px 4px 4px 4pz': false,
    
    '4pz 4px 4px': false,
    '4px 4pz 4px': false,
    '4px 4px 4pz': false,
    
    '4pz 4px': false,
    '4px 4pz': false,
    
    '4pz': false
  }
}