(window.webpackJsonp=window.webpackJsonp||[]).push([[114,71,87],{826:function(e,t,n){var a;(a=function(e){"use strict";function t(e){return new RegExp("^(("+e.join(")|(")+"))\\b")}var n=t(["and","or","not","is"]),a=["as","assert","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","lambda","pass","raise","return","try","while","with","yield","in"],r=["abs","all","any","bin","bool","bytearray","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip","__import__","NotImplemented","Ellipsis","__debug__"];function o(e){return e.scopes[e.scopes.length-1]}e.registerHelper("hintWords","python",a.concat(r)),e.defineMode("python",function(i,c){for(var s="error",u=c.delimiters||c.singleDelimiters||/^[\(\)\[\]\{\}@,:`=;\.\\]/,l=[c.singleOperators,c.doubleOperators,c.doubleDelimiters,c.tripleDelimiters,c.operators||/^([-+*/%\/&|^]=?|[<>=]+|\/\/=?|\*\*=?|!=|[~!@])/],m=0;m<l.length;m++)l[m]||l.splice(m--,1);var f=c.hangingIndent||i.indentUnit,p=a,d=r;void 0!=c.extra_keywords&&(p=p.concat(c.extra_keywords)),void 0!=c.extra_builtins&&(d=d.concat(c.extra_builtins));var h=!(c.version&&Number(c.version)<3);if(h){var b=c.identifiers||/^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/;p=p.concat(["nonlocal","False","True","None","async","await"]),d=d.concat(["ascii","bytes","exec","print"]);var k=new RegExp("^(([rbuf]|(br)|(fr))?('{3}|\"{3}|['\"]))","i")}else{var b=c.identifiers||/^[_A-Za-z][_A-Za-z0-9]*/;p=p.concat(["exec","print"]),d=d.concat(["apply","basestring","buffer","cmp","coerce","execfile","file","intern","long","raw_input","reduce","reload","unichr","unicode","xrange","False","True","None"]);var k=new RegExp("^(([rubf]|(ur)|(br))?('{3}|\"{3}|['\"]))","i")}var g=t(p),x=t(d),y;function v(e,t){var n=e.sol()&&"\\"!=t.lastToken;if(n&&(t.indent=e.indentation()),n&&"py"==o(t).type){var a=o(t).offset;if(e.eatSpace()){var r=e.indentation();return r>a?S(t):r<a&&z(e,t)&&"#"!=e.peek()&&(t.errorToken=!0),null}var i=w(e,t);return a>0&&z(e,t)&&(i+=" "+s),i}return w(e,t)}function w(e,t){if(e.eatSpace())return null;if(e.match(/^#.*/))return"comment";if(e.match(/^[0-9\.]/,!1)){var a=!1;if(e.match(/^[\d_]*\.\d+(e[\+\-]?\d+)?/i)&&(a=!0),e.match(/^[\d_]+\.\d*/)&&(a=!0),e.match(/^\.\d+/)&&(a=!0),a)return e.eat(/J/i),"number";var r=!1;if(e.match(/^0x[0-9a-f_]+/i)&&(r=!0),e.match(/^0b[01_]+/i)&&(r=!0),e.match(/^0o[0-7_]+/i)&&(r=!0),e.match(/^[1-9][\d_]*(e[\+\-]?[\d_]+)?/)&&(e.eat(/J/i),r=!0),e.match(/^0(?![\dx])/i)&&(r=!0),r)return e.eat(/L/i),"number"}var o;if(e.match(k))return-1!==e.current().toLowerCase().indexOf("f")?(t.tokenize=_(e.current(),t.tokenize),t.tokenize(e,t)):(t.tokenize=E(e.current(),t.tokenize),t.tokenize(e,t));for(var i=0;i<l.length;i++)if(e.match(l[i]))return"operator";return e.match(u)?"punctuation":"."==t.lastToken&&e.match(b)?"property":e.match(g)||e.match(n)?"keyword":e.match(x)?"builtin":e.match(/^(self|cls)\b/)?"variable-2":e.match(b)?"def"==t.lastToken||"class"==t.lastToken?"def":"variable":(e.next(),s)}function _(e,t){for(;"rubf".indexOf(e.charAt(0).toLowerCase())>=0;)e=e.substr(1);var n=1==e.length,a="string";function r(t,n){return t.match(e)?(n.tokenize=o,a):t.match("{")?"punctuation":t.match("}")?(n.tokenize=o,"punctuation"):w(t,n)}function o(o,i){for(;!o.eol();)if(o.eatWhile(/[^'"\{\}\\]/),o.eat("\\")){if(o.next(),n&&o.eol())return a}else{if(o.match(e))return i.tokenize=t,a;if(o.match("{{"))return a;if(o.match("{",!1))return i.tokenize=r,o.current()?a:(o.next(),"punctuation");if(o.match("}}"))return a;if(o.match("}"))return s;o.eat(/['"]/)}if(n){if(c.singleLineStringErrors)return s;i.tokenize=t}return a}return o.isString=!0,o}function E(e,t){for(;"rubf".indexOf(e.charAt(0).toLowerCase())>=0;)e=e.substr(1);var n=1==e.length,a="string";function r(r,o){for(;!r.eol();)if(r.eatWhile(/[^'"\\]/),r.eat("\\")){if(r.next(),n&&r.eol())return a}else{if(r.match(e))return o.tokenize=t,a;r.eat(/['"]/)}if(n){if(c.singleLineStringErrors)return s;o.tokenize=t}return a}return r.isString=!0,r}function S(e){for(;"py"!=o(e).type;)e.scopes.pop();e.scopes.push({offset:o(e).offset+i.indentUnit,type:"py",align:null})}function R(e,t,n){var a=e.match(/^([\s\[\{\(]|#.*)*$/,!1)?null:e.column()+1;t.scopes.push({offset:t.indent+f,type:n,align:a})}function z(e,t){for(var n=e.indentation();t.scopes.length>1&&o(t).offset>n;){if("py"!=o(t).type)return!0;t.scopes.pop()}return o(t).offset!=n}function M(e,t){e.sol()&&(t.beginningOfLine=!0);var n=t.tokenize(e,t),a=e.current();if(t.beginningOfLine&&"@"==a)return e.match(b,!1)?"meta":h?"operator":s;if(/\S/.test(a)&&(t.beginningOfLine=!1),"variable"!=n&&"builtin"!=n||"meta"!=t.lastToken||(n="meta"),"pass"!=a&&"return"!=a||(t.dedent+=1),"lambda"==a&&(t.lambda=!0),":"!=a||t.lambda||"py"!=o(t).type||S(t),1==a.length&&!/string|comment/.test(n)){var r="[({".indexOf(a);if(-1!=r&&R(e,t,"])}".slice(r,r+1)),-1!=(r="])}".indexOf(a))){if(o(t).type!=a)return s;t.indent=t.scopes.pop().offset-f}}return t.dedent>0&&e.eol()&&"py"==o(t).type&&(t.scopes.length>1&&t.scopes.pop(),t.dedent-=1),n}return{startState:function(e){return{tokenize:v,scopes:[{offset:e||0,type:"py",align:null}],indent:e||0,lastToken:null,lambda:!1,dedent:0}},token:function(e,t){var n=t.errorToken;n&&(t.errorToken=!1);var a=M(e,t);return a&&"comment"!=a&&(t.lastToken="keyword"==a||"punctuation"==a?e.current():a),"punctuation"==a&&(a=null),e.eol()&&t.lambda&&(t.lambda=!1),n?a+" "+s:a},indent:function(t,n){if(t.tokenize!=v)return t.tokenize.isString?e.Pass:0;var a=o(t),r=a.type==n.charAt(0);return null!=a.align?a.align-(r?1:0):a.offset-(r?f:0)},electricInput:/^\s*[\}\]\)]$/,closeBrackets:{triples:"'\""},lineComment:"#",fold:"indent"}}),e.defineMIME("text/x-python","python");var i=function(e){return e.split(" ")};e.defineMIME("text/x-cython",{name:"python",extra_keywords:i("by cdef cimport cpdef ctypedef enum except extern gil include nogil property public readonly struct union DEF IF ELIF ELSE")})})(n(66))},827:function(e,t,n){var a;(a=function(e){"use strict";e.defineMode("stex",function(e,t){function n(e,t){e.cmdState.push(t)}function a(e){return e.cmdState.length>0?e.cmdState[e.cmdState.length-1]:null}function r(e){var t=e.cmdState.pop();t&&t.closeBracket()}function o(e){for(var t=e.cmdState,n=t.length-1;n>=0;n--){var a=t[n];if("DEFAULT"!=a.name)return a}return{styleIdentifier:function(){return null}}}function i(e,t,n){return function(){this.name=e,this.bracketNo=0,this.style=t,this.styles=n,this.argument=null,this.styleIdentifier=function(){return this.styles[this.bracketNo-1]||null},this.openBracket=function(){return this.bracketNo++,"bracket"},this.closeBracket=function(){}}}var c={};function s(e,t){e.f=t}function u(e,t){var r;if(e.match(/^\\[a-zA-Z@]+/)){var i=e.current().slice(1);return n(t,r=new(r=c[i]||c.DEFAULT)),s(t,m),r.style}if(e.match(/^\\[$&%#{}_]/))return"tag";if(e.match(/^\\[,;!\/\\]/))return"tag";if(e.match("\\["))return s(t,function(e,t){return l(e,t,"\\]")}),"keyword";if(e.match("\\("))return s(t,function(e,t){return l(e,t,"\\)")}),"keyword";if(e.match("$$"))return s(t,function(e,t){return l(e,t,"$$")}),"keyword";if(e.match("$"))return s(t,function(e,t){return l(e,t,"$")}),"keyword";var u=e.next();return"%"==u?(e.skipToEnd(),"comment"):"}"==u||"]"==u?(r=a(t))?(r.closeBracket(u),s(t,m),"bracket"):"error":"{"==u||"["==u?(n(t,r=new(r=c.DEFAULT)),"bracket"):/\d/.test(u)?(e.eatWhile(/[\w.%]/),"atom"):(e.eatWhile(/[\w\-_]/),"begin"==(r=o(t)).name&&(r.argument=e.current()),r.styleIdentifier())}function l(e,t,n){if(e.eatSpace())return null;if(n&&e.match(n))return s(t,u),"keyword";if(e.match(/^\\[a-zA-Z@]+/))return"tag";if(e.match(/^[a-zA-Z]+/))return"variable-2";if(e.match(/^\\[$&%#{}_]/))return"tag";if(e.match(/^\\[,;!\/]/))return"tag";if(e.match(/^[\^_&]/))return"tag";if(e.match(/^[+\-<>|=,\/@!*:;'"`~#?]/))return null;if(e.match(/^(\d+\.\d*|\d*\.\d+|\d+)/))return"number";var a=e.next();return"{"==a||"}"==a||"["==a||"]"==a||"("==a||")"==a?"bracket":"%"==a?(e.skipToEnd(),"comment"):"error"}function m(e,t){var n=e.peek(),o;return"{"==n||"["==n?((o=a(t)).openBracket(n),e.eat(n),s(t,u),"bracket"):/[ \t\r]/.test(n)?(e.eat(n),null):(s(t,u),r(t),u(e,t))}return c.importmodule=i("importmodule","tag",["string","builtin"]),c.documentclass=i("documentclass","tag",["","atom"]),c.usepackage=i("usepackage","tag",["atom"]),c.begin=i("begin","tag",["atom"]),c.end=i("end","tag",["atom"]),c.label=i("label","tag",["atom"]),c.ref=i("ref","tag",["atom"]),c.eqref=i("eqref","tag",["atom"]),c.cite=i("cite","tag",["atom"]),c.bibitem=i("bibitem","tag",["atom"]),c.Bibitem=i("Bibitem","tag",["atom"]),c.RBibitem=i("RBibitem","tag",["atom"]),c.DEFAULT=function(){this.name="DEFAULT",this.style="tag",this.styleIdentifier=this.openBracket=this.closeBracket=function(){}},{startState:function(){var e;return{cmdState:[],f:t.inMathMode?function(e,t){return l(e,t)}:u}},copyState:function(e){return{cmdState:e.cmdState.slice(),f:e.f}},token:function(e,t){return t.f(e,t)},blankLine:function(e){e.f=u,e.cmdState.length=0},lineComment:"%"}}),e.defineMIME("text/x-stex","stex"),e.defineMIME("text/x-latex","stex")})(n(66))},900:function(e,t,n){var a;(a=function(e){"use strict";e.defineMode("rst",function(t,n){var a=/^\*\*[^\*\s](?:[^\*]*[^\*\s])?\*\*/,r=/^\*[^\*\s](?:[^\*]*[^\*\s])?\*/,o=/^``[^`\s](?:[^`]*[^`\s])``/,i=/^(?:[\d]+(?:[\.,]\d+)*)/,c=/^(?:\s\+[\d]+(?:[\.,]\d+)*)/,s=/^(?:\s\-[\d]+(?:[\.,]\d+)*)/,u,l,m,f=new RegExp("^"+"[Hh][Tt][Tt][Pp][Ss]?://"+"(?:[\\d\\w.-]+)\\.(?:\\w{2,6})"+"(?:/[\\d\\w\\#\\%\\&\\-\\.\\,\\/\\:\\=\\?\\~]+)*"),p={token:function(e){if(e.match(a)&&e.match(/\W+|$/,!1))return"strong";if(e.match(r)&&e.match(/\W+|$/,!1))return"em";if(e.match(o)&&e.match(/\W+|$/,!1))return"string-2";if(e.match(i))return"number";if(e.match(c))return"positive";if(e.match(s))return"negative";if(e.match(f))return"link";for(;!(null==e.next()||e.match(a,!1)||e.match(r,!1)||e.match(o,!1)||e.match(i,!1)||e.match(c,!1)||e.match(s,!1)||e.match(f,!1)););return null}},d=e.getMode(t,n.backdrop||"rst-base");return e.overlayMode(d,p,!0)},"python","stex"),e.defineMode("rst-base",function(t){function n(e){var t=Array.prototype.slice.call(arguments,1);return e.replace(/{(\d+)}/g,function(e,n){return void 0!==t[n]?t[n]:e})}var a=e.getMode(t,"python"),r=e.getMode(t,"stex"),o="\\s+",i="(?:\\s*|\\W|$)",c=new RegExp(n("^{0}",i)),s="(?:[^\\W\\d_](?:[\\w!\"#$%&'()\\*\\+,\\-\\./:;<=>\\?]*[^\\W_])?)",u=new RegExp(n("^{0}",s)),l,m=n("(?:{0}|`{1}`)",s,"(?:[^\\W\\d_](?:[\\w\\s!\"#$%&'()\\*\\+,\\-\\./:;<=>\\?]*[^\\W_])?)"),f="(?:[^\\s\\|](?:[^\\|]*[^\\s\\|])?)",p="(?:[^\\`]+)",d=new RegExp(n("^{0}",p)),h=new RegExp("^([!'#$%&\"()*+,-./:;<=>?@\\[\\\\\\]^_`{|}~])\\1{3,}\\s*$"),b=new RegExp(n("^\\.\\.{0}",o)),k=new RegExp(n("^_{0}:{1}|^__:{1}",m,i)),g=new RegExp(n("^{0}::{1}",m,i)),x=new RegExp(n("^\\|{0}\\|{1}{2}::{3}",f,o,m,i)),y=new RegExp(n("^\\[(?:\\d+|#{0}?|\\*)]{1}",m,i)),v=new RegExp(n("^\\[{0}\\]{1}",m,i)),w=new RegExp(n("^\\|{0}\\|",f)),_=new RegExp(n("^\\[(?:\\d+|#{0}?|\\*)]_",m)),E=new RegExp(n("^\\[{0}\\]_",m)),S=new RegExp(n("^{0}__?",m)),R=new RegExp(n("^`{0}`_",p)),z=new RegExp(n("^:{0}:`{1}`{2}",s,p,i)),M=new RegExp(n("^`{1}`:{0}:{2}",s,p,i)),T=new RegExp(n("^:{0}:{1}",s,i)),$=new RegExp(n("^{0}",m)),L=new RegExp(n("^::{0}",i)),C=new RegExp(n("^\\|{0}\\|",f)),A=new RegExp(n("^{0}",o)),F=new RegExp(n("^{0}",m)),P=new RegExp(n("^::{0}",i)),I=new RegExp("^_"),W=new RegExp(n("^{0}|_",m)),B=new RegExp(n("^:{0}",i)),O=new RegExp("^::\\s*$"),D=new RegExp("^\\s+(?:>>>|In \\[\\d+\\]:)\\s");function N(t,n){var o=null;if(t.sol()&&t.match(D,!1))G(n,j,{mode:a,local:e.startState(a)});else if(t.sol()&&t.match(b))G(n,U),o="meta";else if(t.sol()&&t.match(h))G(n,N),o="header";else if(Q(n)==z||t.match(z,!1))switch(K(n)){case 0:G(n,N,H(z,1)),t.match(/^:/),o="meta";break;case 1:G(n,N,H(z,2)),t.match(u),o="keyword",t.current().match(/^(?:math|latex)/)&&(n.tmp_stex=!0);break;case 2:G(n,N,H(z,3)),t.match(/^:`/),o="meta";break;case 3:if(n.tmp_stex&&(n.tmp_stex=void 0,n.tmp={mode:r,local:e.startState(r)}),n.tmp){if("`"==t.peek()){G(n,N,H(z,4)),n.tmp=void 0;break}o=n.tmp.mode.token(t,n.tmp.local);break}G(n,N,H(z,4)),t.match(d),o="string";break;case 4:G(n,N,H(z,5)),t.match(/^`/),o="meta";break;case 5:G(n,N,H(z,6)),t.match(c);break;default:G(n,N)}else if(Q(n)==M||t.match(M,!1))switch(K(n)){case 0:G(n,N,H(M,1)),t.match(/^`/),o="meta";break;case 1:G(n,N,H(M,2)),t.match(d),o="string";break;case 2:G(n,N,H(M,3)),t.match(/^`:/),o="meta";break;case 3:G(n,N,H(M,4)),t.match(u),o="keyword";break;case 4:G(n,N,H(M,5)),t.match(/^:/),o="meta";break;case 5:G(n,N,H(M,6)),t.match(c);break;default:G(n,N)}else if(Q(n)==T||t.match(T,!1))switch(K(n)){case 0:G(n,N,H(T,1)),t.match(/^:/),o="meta";break;case 1:G(n,N,H(T,2)),t.match(u),o="keyword";break;case 2:G(n,N,H(T,3)),t.match(/^:/),o="meta";break;case 3:G(n,N,H(T,4)),t.match(c);break;default:G(n,N)}else if(Q(n)==w||t.match(w,!1))switch(K(n)){case 0:G(n,N,H(w,1)),t.match(C),o="variable-2";break;case 1:G(n,N,H(w,2)),t.match(/^_?_?/)&&(o="link");break;default:G(n,N)}else if(t.match(_))G(n,N),o="quote";else if(t.match(E))G(n,N),o="quote";else if(t.match(S))G(n,N),t.peek()&&!t.peek().match(/^\W$/)||(o="link");else if(Q(n)==R||t.match(R,!1))switch(K(n)){case 0:!t.peek()||t.peek().match(/^\W$/)?G(n,N,H(R,1)):t.match(R);break;case 1:G(n,N,H(R,2)),t.match(/^`/),o="link";break;case 2:G(n,N,H(R,3)),t.match(d);break;case 3:G(n,N,H(R,4)),t.match(/^`_/),o="link";break;default:G(n,N)}else t.match(O)?G(n,q):t.next()&&G(n,N);return o}function U(t,n){var o=null;if(Q(n)==x||t.match(x,!1))switch(K(n)){case 0:G(n,U,H(x,1)),t.match(C),o="variable-2";break;case 1:G(n,U,H(x,2)),t.match(A);break;case 2:G(n,U,H(x,3)),t.match(F),o="keyword";break;case 3:G(n,U,H(x,4)),t.match(P),o="meta";break;default:G(n,N)}else if(Q(n)==g||t.match(g,!1))switch(K(n)){case 0:G(n,U,H(g,1)),t.match($),o="keyword",t.current().match(/^(?:math|latex)/)?n.tmp_stex=!0:t.current().match(/^python/)&&(n.tmp_py=!0);break;case 1:G(n,U,H(g,2)),t.match(L),o="meta",(t.match(/^latex\s*$/)||n.tmp_stex)&&(n.tmp_stex=void 0,G(n,j,{mode:r,local:e.startState(r)}));break;case 2:G(n,U,H(g,3)),(t.match(/^python\s*$/)||n.tmp_py)&&(n.tmp_py=void 0,G(n,j,{mode:a,local:e.startState(a)}));break;default:G(n,N)}else if(Q(n)==k||t.match(k,!1))switch(K(n)){case 0:G(n,U,H(k,1)),t.match(I),t.match(W),o="link";break;case 1:G(n,U,H(k,2)),t.match(B),o="meta";break;default:G(n,N)}else t.match(y)?(G(n,N),o="quote"):t.match(v)?(G(n,N),o="quote"):(t.eatSpace(),t.eol()?G(n,N):(t.skipToEnd(),G(n,Z),o="comment"));return o}function Z(e,t){return J(e,t,"comment")}function q(e,t){return J(e,t,"meta")}function J(e,t,n){return e.eol()||e.eatSpace()?(e.skipToEnd(),n):(G(t,N),null)}function j(e,t){return t.ctx.mode&&t.ctx.local?e.sol()?(e.eatSpace()||G(t,N),null):t.ctx.mode.token(e,t.ctx.local):(G(t,N),null)}function H(e,t,n,a){return{phase:e,stage:t,mode:n,local:a}}function G(e,t,n){e.tok=t,e.ctx=n||{}}function K(e){return e.ctx.stage||0}function Q(e){return e.ctx.phase}return{startState:function(){return{tok:N,ctx:H(void 0,0)}},copyState:function(t){var n=t.ctx,a=t.tmp;return n.local&&(n={mode:n.mode,local:e.copyState(n.mode,n.local)}),a&&(a={mode:a.mode,local:e.copyState(a.mode,a.local)}),{tok:t.tok,ctx:n,tmp:a}},innerMode:function(e){return e.tmp?{state:e.tmp.local,mode:e.tmp.mode}:e.ctx.mode?{state:e.ctx.local,mode:e.ctx.mode}:null},token:function(e,t){return t.tok(e,t)}}},"python","stex"),e.defineMIME("text/x-rst","rst")})(n(66),n(826),n(827),n(939))},939:function(e,t,n){var a;(a=function(e){"use strict";e.overlayMode=function(t,n,a){return{startState:function(){return{base:e.startState(t),overlay:e.startState(n),basePos:0,baseCur:null,overlayPos:0,overlayCur:null,streamSeen:null}},copyState:function(a){return{base:e.copyState(t,a.base),overlay:e.copyState(n,a.overlay),basePos:a.basePos,baseCur:null,overlayPos:a.overlayPos,overlayCur:null}},token:function(e,r){return(e!=r.streamSeen||Math.min(r.basePos,r.overlayPos)<e.start)&&(r.streamSeen=e,r.basePos=r.overlayPos=e.start),e.start==r.basePos&&(r.baseCur=t.token(e,r.base),r.basePos=e.pos),e.start==r.overlayPos&&(e.pos=e.start,r.overlayCur=n.token(e,r.overlay),r.overlayPos=e.pos),e.pos=Math.min(r.basePos,r.overlayPos),null==r.overlayCur?r.baseCur:null!=r.baseCur&&r.overlay.combineTokens||a&&null==r.overlay.combineTokens?r.baseCur+" "+r.overlayCur:r.overlayCur},indent:t.indent&&function(e,n){return t.indent(e.base,n)},electricChars:t.electricChars,innerMode:function(e){return{state:e.base,mode:t}},blankLine:function(e){var r,o;return t.blankLine&&(r=t.blankLine(e.base)),n.blankLine&&(o=n.blankLine(e.overlay)),null==o?r:a&&null!=r?r+" "+o:o}}}})(n(66))}}]);