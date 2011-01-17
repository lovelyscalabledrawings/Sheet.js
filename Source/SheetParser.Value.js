/*
---
name    : SheetParser.Value

authors   : Yaroslaff Fedin

license   : MIT

requires : SheetParser.CSS

provides : SheetParser.Value
...
*/


(function(exports) {
  /*<CommonJS>*/
  var combineRegExp = (typeof require == 'undefined')
    ?  exports.combineRegExp
    :  require('./sg-regex-tools').combineRegExp
  var SheetParser = exports.SheetParser
  /*</CommonJS>*/
  
  var Value = SheetParser.Value = {version: '1.0.2 dev'};
  
  Value.translate = function(value) {
    var found, result = [], matched = [], scope = result, number, func, text;
    var regex = Value.parse;
    var names = regex.names;

    while (found = regex.exec(value)) matched.push(found);
    for (var i = 0; found = matched[i++];) {
      if ((number = found[names.number]) != null) {
        var unit = found[names.unit];
        number = parseFloat(number);
        scope.push(unit ? {number: number, unit: unit} : number)
      } else if (func = found[names['function']]) {
        var obj = {};
        var translated = obj[func] = Value.translate(found[names._arguments]);
        for (var j = 0, bit; bit = translated[j]; j++) if (bit && bit.length == 1) translated[j] = bit[0];
        scope.push(obj);
      } else if ((text = found[names.hex] || found[names.string]|| found[names.dstring] || found[names.keyword] || found[names.direction])) {
        scope.push(text);
      } else if (found[names.comma]) {
        if (!result[0].push) result = [result];
        result.push(scope = []);
      } else if (found[names.whitespace]) {
        var length = scope.length;
        if (length && (scope == result) && !scope[length - 1].push) scope = scope[length - 1] = [scope[length - 1]];
      }
    }
    return result.length == 1 ? result[0] : result;
  }
  
  var x = combineRegExp
  var OR = '|'
  var rRound = "(?:[^()]|\\((?:[^()]|\\((?:[^()]|\\((?:[^()]|\\([^()]*\\))*\\))*\\))*\\))";

  ;(Value.stringDouble = x(/"((?:[^"]|\\")*)"/))
  .names = [                 'dstring']
  ;(Value.stringSingle = x(/'((?:[^']|\\')*)'/))
  .names = [                 'sstring']  
  ;(Value.string = x([Value.stringSingle, OR, Value.stringDouble]))
  ;(Value.keyword = x(/[-a-zA-Z0-9]+/, "keyword"))
  
  ;(Value['function'] = x("([-a-zA-Z0-9]+)\\((" + rRound + "*)\\)"))
  .names = [               'function',       '_arguments']
  
  ;(Value.integer = x(/-?\d+/))
  ;(Value.float = x(/-?\d+\.\d*/))
  ;(Value.number = x(['(', Value.float,  OR, Value.integer, ')']))
  .names = [           'number']

  ;(Value.unit = x(/em|px|pt|%|fr/, 'unit'))
  ;(Value.length = x([Value.number, Value.unit, "?"]))
  ;(Value.direction = x(/top|left|bottom|right|center/, 'direction'))
  ;(Value.position = x([Value.length, OR, Value.direction]))

  ;(Value.hex = x(/#[0-9a-f]+/, 'hex'))

  ;(Value.comma = x(/\s*,\s*/, 'comma'))
  ;(Value.whitespace = x(/\s+/, 'whitespace'))


  Value.parse = x
  (
    [ x(Value.hex)
    , OR
    , x(Value['function']),
    , OR
    , x(Value.position)
    , OR
    , x(Value.comma)
    , OR
    , x(Value.whitespace)
    , OR
    , x(Value.string)
    , OR
    , x(Value.keyword)
    ]
  )
  
})(typeof exports != 'undefined' ? exports : this);