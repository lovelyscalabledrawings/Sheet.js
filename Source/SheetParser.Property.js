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
  
  
  Property.Type = {
    length: function() {
  
    },
  
    color: function(obj) {
      return obj 
    },
    
    number: function() {
      
    },
    
    integer: function() {
      
    },
  
    keyword: function() {
  
    },
    
    strings: function() {
      
    },
    
    url: function() {
      
    },
    
    position: function() {
      
    }
  }
  
  var Styles = Property.Styles = {
    background: [
      ['backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundAttachment', 'backgroundPosition']
    ],
    backgroundColor: ['color', 'transparent', 'inherit'],
    backgroundImage: ['url', 'none', 'inherit'],
    backgroundRepeat: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'inherit'],
    backgroundAttachment: ['fixed', 'scroll', 'inherit'],
    backgroundPosition: [['backgroundPositionX', 'backgroundPositionY']],
    backgroundPositionX: ['position', 'inherit'],
    backgroundPositionY: ['position', 'inherit'],
    
    outline: ['outlineWidth', 'outlineStyle', 'outlineColor'],
    outlineWidth: ['length'],
    outlineStyle: ['dotted', 'dashed', 'solid', 'double', 'groove', 'reidge', 'inset', 'outset'],
    outlineColor: ['color'],
        
    font: [[
      ['fontStyle', 'fontVariant', 'fontWeight'],
      'fontSize',
      ['/', 'lineHeight'],
      'fontFamily'
    ]],
    fontStyle:      ['normal', 'italic', 'oblique', 'inherit'],
    fontVariant:    ['normal', 'bold', 'inherit'],
    fontWeight:     ['number', 'normal', 'bold', 'inherit'],
    fontFamily:     ['strings', 'inherit'],
    fontSize:       ['length', 'percentage', 'inherit', 
                     'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'smaller', 'larger'],
                    
    color:          ['color'],
    letterSpacing:  ['normal', 'length', 'inherit'],
    textDecoration: ['capitalize', 'uppercase', 'lowercase', 'none'],
    textAlign:      ['left', 'right', 'center', 'justify'],
    textIdent:      ['length', 'percentage'],                 
    lineHeight:     ['normal', 'length', 'number', 'percentage'],
    
    height:     ['length', 'auto'],
    maxHeight:  ['length', 'auto'],
    minHeight:  ['length', 'auto'],
    width:      ['length', 'auto'],
    maxWidth:   ['length', 'auto'],
    minWidth:   ['length', 'auto'],
    
    display:    ['inline', 'block', 'list-item', 'run-in', 'inline-block', 'table', 'inline-table', 'none', 
                'table-row-group', 'table-header-group', 'table-footer-group', 'table-row', 
                'table-column-group', 'table-column', 'table-cell', 'table-caption'],
    visibility: ['visible', 'hidden'],
    float:      ['left', 'right', 'none'],
    clear:      ['none', 'left', 'right', 'both', 'inherit'],
    overflow:   ['visible', 'hidden', 'scroll', 'auto'],
    position:   ['static', 'relative', 'absolute', 'fixed'],
    top:        ['length', 'auto'],
    left:       ['length', 'auto'],
    right:      ['length', 'auto'],
    bottom:     ['length', 'auto'],
    zIndex:     ['integer'],
    cursor:     ['auto', 'crosshair', 'default', 'hand', 'move', 'e-resize', 'ne-resize', 'nw-resize', 
                 'n-resize', 'se-resize', 'sw-resize', 's-resize', 'w-resize', 'text', 'wait', 'help'],
                 
    textShadow: [[
      'textShadowBlur',
      'textShadowOffsetX',
      'textShadowOffsetY',
      'textShadowColor'
    ]],
    textShadowBlur:    ['length'],
    textShadowOffsetX: ['length'],
    textShadowOffsetY: ['length'],
    textShadowColor:   ['color'],

    boxShadow: [[
      'boxShadowBlur',
      'boxShadowOffsetX',
      'boxShadowOffsetY',
      'boxShadowColor'
    ]],
    boxShadowBlur:    ['length'],
    boxShadowOffsetX: ['length'],
    boxShadowOffsetY: ['length'],
    boxShadowColor:   ['color']
  }

  var expanded = ['borderWidth', 'borderColor', 'borderStyle', 'padding', 'margin'];
  for (var side, sides = ['Top', 'Right', 'Bottom', 'Left'], i = 0; side = sides[i++];) {
    Styles['border' + side] = [
      ['border' + side + 'Width', 'border' + side + 'Style', 'border' + side + 'Color']
    ];
  
    Styles['border' + side + 'Width'] = ['length', 'thin', 'thick', 'medium'];
    Styles['border' + side + 'Style'] = ['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'inherit', 'none'];
    Styles['border' + side + 'Color'] = ['color'];
  
    Styles['margin' + side] = ['length', 'percentage', 'auto'];
    Styles['padding' + side] = ['length', 'percentage', 'auto'];
  
    for (var j = 0, prop; prop = expanded[j++];) {
      if (!Styles[prop]) Styles[prop] = []
      Styles[prop].push(prop + side)
    }
  
    if (i % 2 == 0) 
      for (var j = 1, prop, adj; adj = sides[j+=2];) 
        Styles[prop = 'borderRadius' + side + adj] = ['length', 'none'];
  }
  
})(typeof exports != 'undefined' ? exports : this);