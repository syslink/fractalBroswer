(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{1090:function(e,r,t){var n;(n=function(e){"use strict";e.defineMode("haskell",function(e,r){function t(e,r,t){return r(t),t(e,r)}var n=/[a-z_]/,a=/[A-Z]/,i=/\d/,o=/[0-9A-Fa-f]/,l=/[0-7]/,u=/[a-z_A-Z0-9'\xa1-\uffff]/,s=/[-!#$%&*+.\/<=>?@\\^|~:]/,f=/[(),;[\]`{}]/,c=/[ \t\v\f]/;function d(e,r){if(e.eatWhile(c))return null;var d=e.next();if(f.test(d)){if("{"==d&&e.eat("-")){var p="comment";return e.eat("#")&&(p="meta"),t(e,r,m(p,1))}return null}if("'"==d)return e.eat("\\"),e.next(),e.eat("'")?"string":"string error";if('"'==d)return t(e,r,h);if(a.test(d))return e.eatWhile(u),e.eat(".")?"qualifier":"variable-2";if(n.test(d))return e.eatWhile(u),"variable";if(i.test(d)){if("0"==d){if(e.eat(/[xX]/))return e.eatWhile(o),"integer";if(e.eat(/[oO]/))return e.eatWhile(l),"number"}e.eatWhile(i);var p="number";return e.match(/^\.\d+/)&&(p="number"),e.eat(/[eE]/)&&(p="number",e.eat(/[-+]/),e.eatWhile(i)),p}if("."==d&&e.eat("."))return"keyword";if(s.test(d)){if("-"==d&&e.eat(/-/)&&(e.eatWhile(/-/),!e.eat(s)))return e.skipToEnd(),"comment";var p="variable";return":"==d&&(p="variable-2"),e.eatWhile(s),p}return"error"}function m(e,r){return 0==r?d:function(t,n){for(var a=r;!t.eol();){var i=t.next();if("{"==i&&t.eat("-"))++a;else if("-"==i&&t.eat("}")&&0==--a)return n(d),e}return n(m(e,a)),e}}function h(e,r){for(;!e.eol();){var t=e.next();if('"'==t)return r(d),"string";if("\\"==t){if(e.eol()||e.eat(c))return r(p),"string";e.eat("&")||e.next()}}return r(d),"string error"}function p(e,r){return e.eat("\\")?t(e,r,h):(e.next(),r(d),"error")}var g=function(){var e={};function t(r){return function(){for(var t=0;t<arguments.length;t++)e[arguments[t]]=r}}t("keyword")("case","class","data","default","deriving","do","else","foreign","if","import","in","infix","infixl","infixr","instance","let","module","newtype","of","then","type","where","_"),t("keyword")("..",":","::","=","\\","<-","->","@","~","=>"),t("builtin")("!!","$!","$","&&","+","++","-",".","/","/=","<","<*","<=","<$>","<*>","=<<","==",">",">=",">>",">>=","^","^^","||","*","*>","**"),t("builtin")("Applicative","Bool","Bounded","Char","Double","EQ","Either","Enum","Eq","False","FilePath","Float","Floating","Fractional","Functor","GT","IO","IOError","Int","Integer","Integral","Just","LT","Left","Maybe","Monad","Nothing","Num","Ord","Ordering","Rational","Read","ReadS","Real","RealFloat","RealFrac","Right","Show","ShowS","String","True"),t("builtin")("abs","acos","acosh","all","and","any","appendFile","asTypeOf","asin","asinh","atan","atan2","atanh","break","catch","ceiling","compare","concat","concatMap","const","cos","cosh","curry","cycle","decodeFloat","div","divMod","drop","dropWhile","either","elem","encodeFloat","enumFrom","enumFromThen","enumFromThenTo","enumFromTo","error","even","exp","exponent","fail","filter","flip","floatDigits","floatRadix","floatRange","floor","fmap","foldl","foldl1","foldr","foldr1","fromEnum","fromInteger","fromIntegral","fromRational","fst","gcd","getChar","getContents","getLine","head","id","init","interact","ioError","isDenormalized","isIEEE","isInfinite","isNaN","isNegativeZero","iterate","last","lcm","length","lex","lines","log","logBase","lookup","map","mapM","mapM_","max","maxBound","maximum","maybe","min","minBound","minimum","mod","negate","not","notElem","null","odd","or","otherwise","pi","pred","print","product","properFraction","pure","putChar","putStr","putStrLn","quot","quotRem","read","readFile","readIO","readList","readLn","readParen","reads","readsPrec","realToFrac","recip","rem","repeat","replicate","return","reverse","round","scaleFloat","scanl","scanl1","scanr","scanr1","seq","sequence","sequence_","show","showChar","showList","showParen","showString","shows","showsPrec","significand","signum","sin","sinh","snd","span","splitAt","sqrt","subtract","succ","sum","tail","take","takeWhile","tan","tanh","toEnum","toInteger","toRational","truncate","uncurry","undefined","unlines","until","unwords","unzip","unzip3","userError","words","writeFile","zip","zip3","zipWith","zipWith3");var n=r.overrideKeywords;if(n)for(var a in n)n.hasOwnProperty(a)&&(e[a]=n[a]);return e}();return{startState:function(){return{f:d}},copyState:function(e){return{f:e.f}},token:function(e,r){var t=r.f(e,function(e){r.f=e}),n=e.current();return g.hasOwnProperty(n)?g[n]:t},blockCommentStart:"{-",blockCommentEnd:"-}",lineComment:"--"}}),e.defineMIME("text/x-haskell","haskell")})(t(85))}}]);