/*
---
name    : SheetParser.Property

authors   : Yaroslaff Fedin

license   : MIT

requires : SheetParser.CSS

provides : SheetParser.Property
...
*/


(function(exports) {
  /*<CommonJS>*/
  var combineRegExp = (typeof require == 'undefined')
    ?  exports.combineRegExp
    :  require('./sg-regex-tools').combineRegExp
  var SheetParser = exports.SheetParser
  /*</CommonJS>*/
  
  var Property = SheetParser.Property = {version: '1.0.2 dev'};
  
  
  Property.expand = function() {
    
  };
  
  
  
  var Styles = Property.Styles = {
    "font": [
      ['fontStyle', 'fontVariant', 'fontWeight'],
      'fontSize',
      ['/', 'lineHeight'],
      'fontFamily'
    ],
  
    "background": [
       ["backgroundColor", "backgroundImage", "backgroundRepeat", "backgroundAttachment", "backgroundPosition"]
    ],
  
    'boxShadow': [
      'boxShadowBlur',
      'boxShadowOffsetX',
      'boxShadowOffsetY',
      'boxShadowColor'
    ],
  
    'textShadow': [
      'textShadowBlur',
      'textShadowOffsetX',
      'textShadowOffsetY',
      'textShadowColor'
    ]
  }

  var Type = Property.Type = {
    length: function() {
  
    },
  
    color: function(obj) {
      return obj 
    },
  
    keywords: function() {
  
    }
  }

  var expanded = ['borderWidth', 'borderColor', 'borderStyle', 'padding', 'margin'];
  for (var side, sides = ['Top', 'Right', 'Bottom', 'Left'], i = 0; side = sides[i++];) {
    Styles['border' + side] = [
      ['border' + side + 'Width', 'border' + side + 'Style', 'border' + side + 'Color']
    ];
  
    Styles['border' + side + 'Width'] = Type.length;
    Styles['border' + side + 'Style'] = Type.keywords('solid', 'dotted', 'dashed');
    Styles['border' + side + 'Color'] = Type.color;
  
    Styles['margin' + side] = Type.length;
    Styles['padding' + side] = Type.length;
  
    for (var j = 0, prop; prop = expanded[j++];) {
      if (!Styles[prop]) Styles[prop] = []
      Styles[prop].push(prop + '-' + side)
    }
  
    if (i % 2 == 0) 
      for (var j = 1, prop, adj; adj = sides[j+=2];) 
        Styles[prop = 'borderRadius' + side + adj] = Type.length;
  }
  
})(typeof exports != 'undefined' ? exports : this);