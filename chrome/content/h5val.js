var h5val = {};
h5val.verbose = 0;
h5val.eof = [ "eof" ];

h5val.inline_elts = { "a":1, "abbr":1, "acronym":1, "applet":1, "b":1,
		      "basefont":1, "bdo":1, "big":1, "br":1, "button":1,
		      "cite":1, "code":1, "dfn":1, "em":1, "font":1, 
		      "i":1, "iframe":1, "img":1, "input":1, "kbd":1,
		      "label":1, "map":1, "n":1, "object":1, "param":1,
		      "q":1, "s":1, "samp":1, "script":1, "select":1,
		      "small":1, "span":1, "strike":1, "strong":1, 
		      "sub":1, "sup":1, "textarea":1, "tt":1, "u":1,
		      "var":1 };

h5val.block_elts = { "address":1, "blockquote":1, "center":1, "dir":1,
		     "div":1, "dl":1, "fieldset":1, "form":1, "h1":1,
		     "h2":1, "h3":1, "h4":1, "h5":1, "h6":1, "hr":1,
		     "isindex":1, "menu":1, "noframes":1, "noscript":1,
		     "ol":1, "p":1, "pre":1, "table":1, "ul":1 };

h5val.restricted_elts = {
    "applet": { "BLOCK":1 },
    "base": {},
    "blockquote": { "BLOCK":1 },
    "body": { "BLOCK":1 },
    "button": { "BLOCK":1 },
    "caption": {},
    "center": { "BLOCK":1 },
    "col": {},
    "colgroup": { "col":1 },
    "dd": { "BLOCK":1 },
    "del": { "BLOCK":1 },
    "dir": { "BLOCK":1 },
    "div": { "BLOCK":1 },
    "dl": { "dt":1, "dd":1 },
    "fieldset": { "BLOCK":1 },
    "form": { "BLOCK":1 },
    "head": { "title":1, "isindex":1, "base":1, "script":1,
	      "style":1, "meta":1, "link":1, "object":1 },
    "html": { "head":1, "body":1 },
    "iframe": { "BLOCK":1 },
    "ins": { "BLOCK":1 },
    "li": { "BLOCK":1 },
    "link": {},
    "map": { "BLOCK":1 },
    "menu": { "BLOCK":1 },
    "meta": {},
    "noframes": { "BLOCK":1 },
    "noscript": { "BLOCK":1 },
    "object": { "BLOCK":1 },
    "ol": { "li":1 },
    "optgroup": { "option":1 },
    "option": {},
    "select": { "optgroup":1, "option":1 },
    "style": {},
    "table": {"caption":1, "col":1, "colgroup":1,
	      "thead":1, "tfoot":1, "tbody":1},
    "tbody": { "tr":1 },
    "td": { "BLOCK":1 },
    "tfoot": { "tr":1 },
    "th": { "BLOCK":1 },
    "thead": { "tr":1 },
    "title": {},
    "tr": { "th":1, "td":1 },
    "ul": { "li":1 },

    /* not sure about these html5 elts */
    "section": { "BLOCK":1 },
    "header": { "BLOCK":1 },
    "footer": { "BLOCK":1 },
    "nav": { "BLOCK":1 },

};

h5val.entities = { "aacute":1, "acirc":1, "acute":1, "aelig":1,
		   "agrave":1, "alefsym":1, "alpha":1, "amp":1, "and":1,
		   "ang":1, "aring":1, "asymp":1, "atilde":1, "auml":1,
		   "bdquo":1, "beta":1, "brvbar":1, "bull":1, "cap":1,
		   "ccedil":1, "cedil":1, "cent":1, "chi":1, "circ":1,
		   "clubs":1, "cong":1, "copy":1, "crarr":1, "cup":1,
		   "curren":1, "dagger":1, "darr":1, "deg":1, "delta":1,
		   "diams":1, "divide":1, "eacute":1, "ecirc":1,
		   "egrave":1, "empty":1, "emsp":1, "ensp":1,
		   "epsilon":1, "equiv":1, "eta":1, "eth":1, "euml":1,
		   "euro":1, "exist":1, "fnof":1, "forall":1, "frac12":1,
		   "frac14":1, "frac34":1, "frasl":1, "gamma":1, "ge":1,
		   "gt":1, "harr":1, "hearts":1, "hellip":1, "iacute":1,
		   "icirc":1, "iexcl":1, "igrave":1, "image":1, "infin":1,
		   "int":1, "iota":1, "iquest":1, "isin":1, "iuml":1,
		   "kappa":1, "lambda":1, "lang":1, "laquo":1, "larr":1,
		   "lceil":1, "ldquo":1, "le":1, "lfloor":1, "lowast":1,
		   "loz":1, "lrm":1, "lsaquo":1, "lsquo":1, "lt":1,
		   "macr":1, "mdash":1, "micro":1, "middot":1, "minus":1,
		   "mu":1, "nabla":1, "nbsp":1, "ndash":1, "ne":1, "ni":1,
		   "not":1, "notin":1, "nsub":1, "ntilde":1, "nu":1,
		   "oacute":1, "ocirc":1, "oelig":1, "ograve":1, "oline":1,
		   "omega":1, "omicron":1, "oplus":1, "or":1, "ordf":1,
		   "ordm":1, "oslash":1, "otilde":1, "otimes":1, "ouml":1,
		   "para":1, "part":1, "permil":1, "perp":1, "phi":1,
		   "pi":1, "piv":1, "plusmn":1, "pound":1, "prime":1,
		   "prod":1, "prop":1, "psi":1, "quot":1, "radic":1,
		   "rang":1, "raquo":1, "rarr":1, "rceil":1, "rdquo":1,
		   "real":1, "reg":1, "rfloor":1, "rho":1, "rlm":1,
		   "rsaquo":1, "rsquo":1, "sbquo":1, "scaron":1,
		   "sdot":1, "sect":1, "shy":1, "sigma":1, "sigmaf":1,
		   "sim":1, "spades":1, "sub":1, "sube":1, "sum":1,
		   "sup":1, "sup1":1, "sup2":1, "sup3":1, "supe":1,
		   "szlig":1, "tau":1, "there4":1, "theta":1, "thetasym":1,
		   "thinsp":1, "thorn":1, "tilde":1, "times":1, "trade":1,
		   "uacute":1, "uarr":1, "ucirc":1, "ugrave":1, "uml":1,
		   "upsih":1, "upsilon":1, "uuml":1, "weierp":1, "xi":1,
		   "yacute":1, "yen":1, "yuml":1, "zeta":1, "zwj":1,
		   "zwnj":1 };

h5val.check_nesting = function (parent, child) {
    if (h5val.verbose)
	h5val.log ("check_nesting("+parent+","+child+")");

    var is_inline = h5val.inline_elts[child];
    var is_block = h5val.block_elts[child];
    var is_restricted = h5val.restricted_elts[child];

    if (! is_inline && ! is_block && ! is_restricted)
	return ("invalid tag " + child);

    if (parent == null)
	return null;

    if (h5val.verbose)
	h5val.log ("parent = '" + parent + "'\n");

    var allowed = h5val.restricted_elts[parent];
    if (allowed) {
	if (allowed["BLOCK"])
	    return (null); /* ok */
	if (allowed[child])
	    return (null); /* ok */
	return ("invalid nesting: " + parent + " may not contain " + child);
    }
	
    if (is_inline)
	return null;

    return ("invalid block: " + parent + " may not contain " + child);
}

h5val.log = function (str) {
    console.log (str);
}

h5val.isalpha = [];
h5val.isalnum = [];
h5val.isid = [];
h5val.isspace = [];

for (var c = "a"; c < "z"; c = String.fromCharCode (c.charCodeAt(0) + 1)) {
    h5val.isalpha[c] = 1;
    h5val.isalnum[c] = 1;
    h5val.isid[c] = 1;
}
for (var c = "A"; c < "Z"; c = String.fromCharCode (c.charCodeAt(0) + 1)) {
    h5val.isalpha[c] = 1;
    h5val.isalnum[c] = 1;
    h5val.isid[c] = 1;
}
for (var c = "0"; c < "9"; c = String.fromCharCode (c.charCodeAt(0) + 1)) {
    h5val.isalnum[c] = 1;
    h5val.isid[c] = 1;
}
h5val.isid['-'] = 1;
h5val.isid['_'] = 1;

h5val.isspace[' '] = 1;
h5val.isspace["\t"] = 1;
h5val.isspace["\r"] = 1;
h5val.isspace["\n"] = 1;

h5val.getc = function (inf) {
    var c;

    if (inf.off >= inf.limit)
	return h5val.eof;

    if (inf.data[inf.off] != "<" || inf.data[inf.off+1] != "!") {
	c = inf.data[inf.off++];
	if (c == "\n")
	    inf.linenum++;
	return (c);
    }

    if (inf.data.substr (inf.off, 4) == "<!--") {
	inf.off += 4;
	while (inf.off < inf.limit) {
	    if (inf.data[inf.off] == "-"
		&& inf.data.substr (inf.off, 3) == "-->") {
		inf.off += 3;
		break;
	    }
	    c = inf.data[inf.off++];
	    if (c == "\n")
		inf.linenum++;
	}
	return (" ");
    }

    if (inf.data.substr (inf.off, 9) == "<![CDATA[") {
	inf.off += 9;
	while (inf.off < inf.limit) {
	    if (inf.data[inf.off] == "]"
		& inf.data.substr (inf.off, 3) == "]]>") {
		inf.off += 3;
		break;
	    }
	    c = inf.data[inf.off++];
	    if (c == "\n")
		inf.linenum++;
	}
	return (" ");
    }

    if (inf.data.substr (inf.off, 9) == "<!DOCTYPE") {
	inf.off += 9;
	while (inf.off < inf.limit) {
	    c = inf.data[inf.off++];
	    if (c == "\n")
		inf.linenum++;
	    if (c == ">")
		break;
	}
	return (" ");
    }

    inf.errmsg = "invalid <! construction";
    return (h5val.eof);
}

h5val.peekc = function (inf) {
    if (inf.off >= inf.limit)
	return (h5val.eof);
    return (inf.data[inf.off]);
}

h5val.unget = function (inf) {
    if (inf.off <= 0)
	return (h5val.eof);
    inf.off--;
    var c = inf.data[inf.off];
    if (c == "\n")
	inf.linenum--;
    return (c);
}

h5val.skip_whitespace = function (inf) {
    while (inf.off < inf.limit) {
	c = inf.data[inf.off];
	if (c != " " && c != "\t" && c != "\r" && c != "\n")
	    break;
	inf.off++;
    }
}

h5val.valid_entity = function (str) {
    if (h5val.entities[str.toLowerCase()])
	return 1;
    if (str[0] == "#")
	return (1);
    return (0);
}

h5val.regexp_ent = new RegExp ("^([-_a-zA-Z0-9#]+);");
h5val.regexp_tag = new RegExp ("^([-_a-zA-Z0-9]+)");

h5val.validate_entity = function (inf) {
    var s, parts, ent_name;

    s = inf.data.substr (inf.off, 10);
    parts = h5val.regexp_ent.exec (s);
    if (! parts) {
	if (inf.relax_entities)
	    return null;
	return "entity syntax error";
    }
    ent_name = parts[1];
    inf.off += ent_name.length + 1;
    if (! h5val.valid_entity (ent_name)) {
	if (inf.relax_entities)
	    return null;
	return "invalid entity " + ent_name;
    }
    return null;
}

h5val.validate_children = function (indent, parent_tag, inf) {
    if (h5val.verbose)
	h5val.log (indent+"validate_children("+parent_tag+")");
    var s, part, ent_name, tag_name, r, tag, parts;

    if (parent_tag == "script")
	inf.relax_entities = 1;

    while (1) {
	c = h5val.getc (inf);
	if (c == h5val.eof) {
	    return h5val.eof;
	} else if (c == "&") {
	    r = h5val.validate_entity (inf);
	    if (r)
		return (r);
	} else if (c == "<") {
	    if (h5val.peekc (inf) == "/") {
		h5val.getc (inf);
		s = inf.data.substr (inf.off, 20);
		parts = h5val.regexp_tag.exec (s);
		if (! parts) {
		    return ("close tag syntax error:"
			    + "junk after less-than, slash");
		}
		tag_name = parts[1];
		if (h5val.verbose >= 9)
		    h5val.log ("soak " + tag_name);
		inf.off += tag_name.length;
		c = h5val.getc (inf);
		if (c != ">") {
		    return ("close tag syntax error:"
			    + "junk before final greater-than");
		}

		if (h5val.verbose)
		    h5val.log ("handle <"+parent_tag+">...</"+tag_name+">");

		if (parent_tag != tag_name) {
		    return ("incorrect close tag: got "
			    + tag_name + "; expected " + parent_tag);
		}
		return null;
	    }

	    s = inf.data.substr (inf.off, 20);
	    parts = h5val.regexp_tag.exec (s);
	    if (! parts)
		return "tag syntax error";
	    tag_name = parts[1];
	    inf.off += tag_name.length;

	    r = h5val.check_nesting (parent_tag, tag_name);
	    if (r)
		return (r);
	    
	    r = h5val.validate_tag (indent, tag_name, inf);
	    if (r)
		return r;
	}
    }
    return (null);
}

/* we've read the less than and the tag name; now soak up attrs */
h5val.validate_tag = function (indent, tag_name, inf) {
    var r, c;
    var attrs = [];
    var attrname, attrval;
    var in_quotes;

    if (h5val.verbose) {
	h5val.log (indent + "validate_tag(" + tag_name + ")");
	indent += "  ";
    }

    while (1) {
	if ((c = h5val.getc (inf)) == h5val.eof)
	    return "unexpected EOF reading attrs";
	if (c == "&") {
	    r = h5val.validate_entity (inf);
	    if (r)
		return r;
	} if (h5val.isalpha[c]) {
	    attrname = c;
	    while (1) {
		c = h5val.getc (inf);
		if (c == h5val.eof)
		    return "unexpected EOF reading attrname";
		if (! h5val.isid[c])
		    break;
		attrname += c;
	    }
	    attrval = "";
	    if (c == "=") {
		c = h5val.getc (inf);
		in_quotes = 0;
		if (c == "'" || c == '"') {
		    in_quotes = c;
		} else {
		    attrval += c;
		}
		while (1) {
		    c = h5val.getc (inf);
		    if (c == h5val.eof)
			return "unexpected EOF reading attrval";
		    if (c == "&") {
			/* note: discards actual entity */
			r = h5val.validate_entity (inf);
			if (r)
			    return (r);
		    }
		    if (in_quotes) {
			if (c == in_quotes)
			    break;
		    } else if (h5val.isspace[c]) {
			h5val.unget (inf);
			break;
		    } else if (! h5val.isid[c]) {
			return "bad char in attrval";
		    }
		    
		    attrval += c;
		}
	    } else {
		h5val.unget (inf);
	    }

	    if (h5val.verbose)
		h5val.log (indent + "got attr " + attrname + " = " + attrval);

	} else if (c == "/") {
	    c = h5val.getc (inf);
	    if (c != ">")
		return "self-close syntax error " + tag_name;
	    r = h5val.validate_attrs (tag_name, attrs);
	    return r;
	} else if (c == ">") {
	    r = h5val.validate_attrs (tag_name, attrs);
	    if (r)
		return r;
	    r = h5val.validate_children (indent, tag_name, inf);
	    inf.relax_entities = 0;
	    if (r == h5val.eof)
		return "unexpected eof looking for end of " + tag_name;
	    return (r);
	}
    }
}

h5val.validate_attrs = function (tag_name, attrs) {
    return null; /* ok */
}

h5val.validate = function (str) {
    var inf = {};
    inf.data = str;
    inf.off = 0;
    inf.limit = str.length;
    inf.linenum = 1;
    inf.errmsg = "";
    inf.relax_entities = 0;

    var errmsg = h5val.validate_children ("", null, inf);
    if (errmsg == null || errmsg == h5val.eof)
	return null;

    if (inf.errmsg)
	errmsg = inf.errmsg;

    h5val.verbose = 0;

    var ret = {};
    ret.linenum = inf.linenum;
    ret.summary = errmsg;
    ret.lines = [];
    var output_linenum = 0;

    var start_linenum = inf.linenum - 5;
    var end_linenum = inf.linenum + 5;

    while ((c = h5val.unget (inf)) != h5val.eof) {
	if (inf.linenum <= start_linenum)
	    break;
    }
    h5val.getc (inf);
    
    var cur_linenum = inf.linenum;
    var cur_line = "";

    while (inf.off < inf.limit) {
	c = inf.data[inf.off++];
	if (c == "\n")
	    inf.linenum++;
	if (inf.linenum > end_linenum)
	    break;

	cur_line += c;

	if (c == "\n") {
	    ret.lines[output_linenum++] = [cur_linenum, cur_line];
	    cur_linenum = inf.linenum;
	    cur_line = "";
	}
    }

    if (cur_line)
	ret.lines[output_linenum++] = [cur_linenum, cur_line];

    return (ret);
}

/* for testing under command line node.js */
if (typeof exports != "undefined") {
    exports.validate = h5val.validate;
}
