(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{925:function(e,n,t){var r;(r=function(e){"use strict";e.defineMode("vb",function(n,t){var r="error";function i(e){return new RegExp("^(("+e.join(")|(")+"))\\b","i")}var a=new RegExp("^[\\+\\-\\*/%&\\\\|\\^~<>!]"),c=new RegExp("^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]"),o=new RegExp("^((==)|(<>)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))"),u=new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))"),d=new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))"),l=new RegExp("^[_A-Za-z][_A-Za-z0-9]*"),h=["class","module","sub","enum","select","while","if","function","get","set","property","try"],s=["else","elseif","case","catch"],f=["next","loop"],m=["and","or","not","xor","in"],p=i(m),k=["as","dim","break","continue","optional","then","until","goto","byval","byref","new","handles","property","return","const","private","protected","friend","public","shared","static","true","false"],w=["integer","string","double","decimal","boolean","short","char","float","single"],g=i(k),v=i(w),b='"',x=i(h),I=i(s),y=i(f),E=i(["end"]),L=i(["do"]),z=null,C;function R(e,n){n.currentIndent++}function F(e,n){n.currentIndent--}function J(e,n){if(e.eatSpace())return null;var t;if("'"===e.peek())return e.skipToEnd(),"comment";if(e.match(/^((&H)|(&O))?[0-9\.a-f]/i,!1)){var i=!1;if(e.match(/^\d*\.\d+F?/i)?i=!0:e.match(/^\d+\.\d*F?/)?i=!0:e.match(/^\.\d+F?/)&&(i=!0),i)return e.eat(/J/i),"number";var h=!1;if(e.match(/^&H[0-9a-f]+/i)?h=!0:e.match(/^&O[0-7]+/i)?h=!0:e.match(/^[1-9]\d*F?/)?(e.eat(/J/i),h=!0):e.match(/^0(?![\dx])/i)&&(h=!0),h)return e.eat(/L/i),"number"}return e.match(b)?(n.tokenize=O(e.current()),n.tokenize(e,n)):e.match(d)||e.match(u)?null:e.match(o)||e.match(a)||e.match(p)?"operator":e.match(c)?null:e.match(L)?(R(e,n),n.doInCurrentLine=!0,"keyword"):e.match(x)?(n.doInCurrentLine?n.doInCurrentLine=!1:R(e,n),"keyword"):e.match(I)?"keyword":e.match(E)?(F(e,n),F(e,n),"keyword"):e.match(y)?(F(e,n),"keyword"):e.match(v)?"keyword":e.match(g)?"keyword":e.match(l)?"variable":(e.next(),r)}function O(e){var n=1==e.length,i="string";return function(i,a){for(;!i.eol();){if(i.eatWhile(/[^'"]/),i.match(e))return a.tokenize=J,"string";i.eat(/['"]/)}if(n){if(t.singleLineStringErrors)return r;a.tokenize=J}return"string"}}function T(e,n){var t=n.tokenize(e,n),i=e.current();if("."===i)return"variable"===(t=n.tokenize(e,n))?"variable":r;var a="[({".indexOf(i);return-1!==a&&R(e,n),"dedent"===z&&F(e,n)?r:-1!==(a="])}".indexOf(i))&&F(e,n)?r:t}return e.registerHelper("hintWords","vb",h.concat(s).concat(f).concat(m).concat(k).concat(w)),{electricChars:"dDpPtTfFeE ",startState:function(){return{tokenize:J,lastToken:null,currentIndent:0,nextLineIndent:0,doInCurrentLine:!1}},token:function(e,n){e.sol()&&(n.currentIndent+=n.nextLineIndent,n.nextLineIndent=0,n.doInCurrentLine=0);var t=T(e,n);return n.lastToken={style:t,content:e.current()},t},indent:function(e,t){var r=t.replace(/^\s+|\s+$/g,"");return r.match(y)||r.match(E)||r.match(I)?n.indentUnit*(e.currentIndent-1):e.currentIndent<0?0:e.currentIndent*n.indentUnit},lineComment:"'"}}),e.defineMIME("text/x-vb","vb")})(t(66))}}]);