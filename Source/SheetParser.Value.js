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
  var combineRegExp = (typeof module === 'undefined' || !module.exports)
    ?  exports.combineRegExp
    :  require('./sg-regex-tools').combineRegExp
  var SheetParser = exports.SheetParser
  /*</CommonJS>*/
  
  var Value = SheetParser.Value = {version: '1.2.2 dev'};
  
  Value.translate = function(value, expression) {
    var found, result = [], matched = [], scope = result
    var regex = Value.tokenize, names = regex.names;
    var chr, unit, number, func, text, operator;
    while (found = regex.exec(value)) matched.push(found);
    for (var i = 0; found = matched[i++];) {
      if ((text = found[names._arguments])) {
        var translated = Value.translate(text, true), func = found[names['function']];
        for (var j = 0, bit; bit = translated[j]; j++) if (bit && bit.length == 1) translated[j] = bit[0];
        if (func && ((operator = operators[func]) == null)) {
          var obj = {};
          obj[func] = translated;
          scope.push(obj);
        } else {
          if (isFinite(translated)) {
            scope.push((operator ? 1 : -1) * translated)
          } else {
            if (operator != null) scope.push(func);
            scope.push(translated);
          }
        }
      } else if ((text = (found[names.number]))) {
        number = parseFloat(text), unit = found[names.unit];
        if (expression && scope.length) {
          chr = text.charAt(0);
          if ((operator = operators[chr]) != null) {
            var last = scope[scope.length - 1];
            if (!last || !last.match || !last.match(Value.operator)) {
              scope.push(chr);
              if (!operator) number = - number;
            }
          };
        }
        scope.push(unit ? {number: number, unit: unit} : number);
      } else if (found[names.comma]) {
        if (!result[0].push) result = [result];
        result.push(scope = []);
      } else if (found[names.whitespace]) {
        var length = !expression && scope.length;
        if (length && (scope == result) && !scope[length - 1].push) scope = scope[length - 1] = [scope[length - 1]];
      } else if (text = (found[names.dstring] || found[names.sstring] || found[names.token])) {
        scope.push(text);
      } else if (text = (found[names.operator])) {
        expression = true;
        scope.push(text);
      }
    } 
    return result.length == 1 ? result[0] : result;
  };
  var operators = {'-': false, '+': true};
  var x = combineRegExp
  var OR = '|'
  var rRound = "(?:[^()]|\\((?:[^()]|\\((?:[^()]|\\((?:[^()]|\\([^()]*\\))*\\))*\\))*\\))";

  ;(Value['function'] = x("([-_a-zA-Z0-9]*)\\((" + rRound + "*)\\)"))
  .names = [               'function',       '_arguments']
  
  ;(Value.integer = x(/[-+]?\d+/))
  ;(Value['float'] = x(/[-+]?(?:\d+\.\d*|\d*\.\d+)/))
  ;(Value.length = x(['(', Value['float'],  OR, Value['integer'], ')', '(em|px|pt|%|fr|deg|(?=$|[^a-zA-Z0-9.]))']))
  .names = [           'number',                                        'unit'];
  
  ;(Value.comma = x(/\s*,\s*/, 'comma'))
  ;(Value.whitespace = x(/\s+/, 'whitespace'))
  ;(Value.operator = x(/[-+]|[\/%^~=><*\^]+/, 'operator'))

  ;(Value.stringDouble = x(/"((?:[^"]|\\")*)"/)).names = ['dstring']
  ;(Value.stringSingle = x(/'((?:[^']|\\')*)'/)).names = ['sstring']
  ;(Value.string = x([Value.stringSingle, OR, Value.stringDouble]))
  ;(Value.token = x(/[^$,\s\/())]+/, "token"))
  
  Value.tokenize = x
  (
    [ x(Value['function']),
    , OR
    , x(Value.comma)
    , OR
    , x(Value.whitespace)
    , OR
    , x(Value.string)
    , OR
    , x(Value.length)
    , OR
    , x(Value.operator)
    , OR
    , x(Value.token)
    ]
  )
})(typeof exports != 'undefined' ? exports : this);