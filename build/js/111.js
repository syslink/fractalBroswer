(window.webpackJsonp=window.webpackJsonp||[]).push([[111,110],{1002:function(t,n,e){var r;(r=function(t){"use strict";t.defineMode("yaml",function(){var t,n=new RegExp("\\b(("+["true","false","on","off","yes","no"].join(")|(")+"))$","i");return{token:function(t,e){var r=t.peek(),i=e.escaped;if(e.escaped=!1,"#"==r&&(0==t.pos||/\s/.test(t.string.charAt(t.pos-1))))return t.skipToEnd(),"comment";if(t.match(/^('([^']|\\.)*'?|"([^"]|\\.)*"?)/))return"string";if(e.literal&&t.indentation()>e.keyCol)return t.skipToEnd(),"string";if(e.literal&&(e.literal=!1),t.sol()){if(e.keyCol=0,e.pair=!1,e.pairStart=!1,t.match(/---/))return"def";if(t.match(/\.\.\./))return"def";if(t.match(/\s*-\s+/))return"meta"}if(t.match(/^(\{|\}|\[|\])/))return"{"==r?e.inlinePairs++:"}"==r?e.inlinePairs--:"["==r?e.inlineList++:e.inlineList--,"meta";if(e.inlineList>0&&!i&&","==r)return t.next(),"meta";if(e.inlinePairs>0&&!i&&","==r)return e.keyCol=0,e.pair=!1,e.pairStart=!1,t.next(),"meta";if(e.pairStart){if(t.match(/^\s*(\||\>)\s*/))return e.literal=!0,"meta";if(t.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i))return"variable-2";if(0==e.inlinePairs&&t.match(/^\s*-?[0-9\.\,]+\s?$/))return"number";if(e.inlinePairs>0&&t.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/))return"number";if(t.match(n))return"keyword"}return!e.pair&&t.match(/^\s*(?:[,\[\]{}&*!|>'"%@`][^\s'":]|[^,\[\]{}#&*!|>'"%@`])[^#]*?(?=\s*:($|\s))/)?(e.pair=!0,e.keyCol=t.indentation(),"atom"):e.pair&&t.match(/^:\s*/)?(e.pairStart=!0,"meta"):(e.pairStart=!1,e.escaped="\\"==r,t.next(),null)},startState:function(){return{pair:!1,pairStart:!1,keyCol:0,inlinePairs:0,inlineList:0,literal:!1,escaped:!1}},lineComment:"#",fold:"indent"}}),t.defineMIME("text/x-yaml","yaml"),t.defineMIME("text/yaml","yaml")})(e(74))},1108:function(t,n,e){var r;(r=function(t){var n=0,e=1,r=2;t.defineMode("yaml-frontmatter",function(n,e){var i=t.getMode(n,"yaml"),a=t.getMode(n,e&&e.base||"gfm");function s(t){return t.state==r?a:i}return{startState:function(){return{state:0,inner:t.startState(i)}},copyState:function(n){return{state:n.state,inner:t.copyState(s(n),n.inner)}},token:function(n,e){if(0==e.state)return n.match(/---/,!1)?(e.state=1,i.token(n,e.inner)):(e.state=r,e.inner=t.startState(a),a.token(n,e.inner));if(1==e.state){var s=n.sol()&&n.match(/---/,!1),o=i.token(n,e.inner);return s&&(e.state=r,e.inner=t.startState(a)),o}return a.token(n,e.inner)},innerMode:function(t){return{mode:s(t),state:t.inner}},blankLine:function(t){var n=s(t);if(n.blankLine)return n.blankLine(t.inner)}}})})(e(74),e(1002))}}]);