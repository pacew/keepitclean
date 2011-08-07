dump ("this is val2.js a\n");
var x = document.getElementById ("val2text");
dump_val ("x", x);
dump_val ("x.hidden", x.hidden);
dump_val ("foo", x.getAttribute ("value"));

x.setAttribute ("value", "xyzzy1");



