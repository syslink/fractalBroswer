(window.webpackJsonp=window.webpackJsonp||[]).push([[109],{934:function(e,n,t){var r;(r=function(e){"use strict";e.defineMode("yacas",function(n,t){function r(e){for(var n={},t=e.split(" "),r=0;r<t.length;++r)n[t[r]]=!0;return n}var o=r("Assert BackQuote D Defun Deriv For ForEach FromFile FromString Function Integrate InverseTaylor Limit LocalSymbols Macro MacroRule MacroRulePattern NIntegrate Rule RulePattern Subst TD TExplicitSum TSum Taylor Taylor1 Taylor2 Taylor3 ToFile ToStdout ToString TraceRule Until While"),a,i="(?:[a-zA-Z\\$'][a-zA-Z0-9\\$']*)",c=new RegExp("(?:(?:\\.\\d+|\\d+\\.\\d*|\\d+)(?:[eE][+-]?\\d+)?)"),u=new RegExp(i),s=new RegExp(i+"?_"+i),l=new RegExp(i+"\\s*\\(");function p(e,n){var t;if('"'===(t=e.next()))return n.tokenize=f,n.tokenize(e,n);if("/"===t){if(e.eat("*"))return n.tokenize=m,n.tokenize(e,n);if(e.eat("/"))return e.skipToEnd(),"comment"}e.backUp(1);var r=e.match(/^(\w+)\s*\(/,!1);null!==r&&o.hasOwnProperty(r[1])&&n.scopes.push("bodied");var a=d(n);if("bodied"===a&&"["===t&&n.scopes.pop(),"["!==t&&"{"!==t&&"("!==t||n.scopes.push(t),("["===(a=d(n))&&"]"===t||"{"===a&&"}"===t||"("===a&&")"===t)&&n.scopes.pop(),";"===t)for(;"bodied"===a;)n.scopes.pop(),a=d(n);return e.match(/\d+ *#/,!0,!1)?"qualifier":e.match(c,!0,!1)?"number":e.match(s,!0,!1)?"variable-3":e.match(/(?:\[|\]|{|}|\(|\))/,!0,!1)?"bracket":e.match(l,!0,!1)?(e.backUp(1),"variable"):e.match(u,!0,!1)?"variable-2":e.match(/(?:\\|\+|\-|\*|\/|,|;|\.|:|@|~|=|>|<|&|\||_|`|'|\^|\?|!|%|#)/,!0,!1)?"operator":"error"}function f(e,n){for(var t,r=!1,o=!1;null!=(t=e.next());){if('"'===t&&!o){r=!0;break}o=!o&&"\\"===t}return r&&!o&&(n.tokenize=p),"string"}function m(e,n){for(var t,r;null!=(r=e.next());){if("*"===t&&"/"===r){n.tokenize=p;break}t=r}return"comment"}function d(e){var n=null;return e.scopes.length>0&&(n=e.scopes[e.scopes.length-1]),n}return{startState:function(){return{tokenize:p,scopes:[]}},token:function(e,n){return e.eatSpace()?null:n.tokenize(e,n)},indent:function(t,r){if(t.tokenize!==p&&null!==t.tokenize)return e.Pass;var o=0;return"]"!==r&&"];"!==r&&"}"!==r&&"};"!==r&&");"!==r||(o=-1),(t.scopes.length+o)*n.indentUnit},electricChars:"{}[]();",blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//"}}),e.defineMIME("text/x-yacas",{name:"yacas"})})(t(66))}}]);