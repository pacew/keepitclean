var h5val = {};
h5val.verbose = 9;
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
    "blockquote": { "BLOCK":1 },
    "body": { "BLOCK":1 },
    "button": { "BLOCK":1 },
    "center": { "BLOCK":1 },
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
    "map": { "BLOCK":1 },
    "menu": { "BLOCK":1 },
    "noframes": { "BLOCK":1 },
    "noscript": { "BLOCK":1 },
    "object": { "BLOCK":1 },
    "ol": { "li":1 },
    "optgroup": { "option":1 },
    "select": { "optgroup":1, "option":1 },
    "table": {"caption":1, "col":1, "colgroup":1,
	      "thead":1, "tfoot":1, "tbody":1},
    "tbody": { "tr":1 },
    "td": { "BLOCK":1 },
    "tfoot": { "tr":1 },
    "th": { "BLOCK":1 },
    "thead": { "tr":1 },
    "title": {},
    "tr": { "th":1, "td":1 },
    "ul": { "li":1 }
};

h5val.check_nesting = function (parent, child) {
    h5val.log ("check_nesting("+parent+","+child+")");

    var is_inline = h5val.inline_elts[child];
    var is_block = h5val.block_elts[child];
    var is_restricted = h5val.restricted_elts[child];

    if (! is_inline && ! is_block && ! is_restricted)
	return ("invalid tag " + child);

    if (parent == null)
	return null;

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

    while (1) {
	if (inf.off >= inf.limit)
	    return (h5val.eof);

	c = inf.data[inf.off++];
    
	if (c == "\n")
	    inf.linenum++;

	/* check for <!-- */
	if (c == "<"
	    && inf.data[inf.off] == "!"
	    && inf.data[inf.off + 1] == "-"
	    && inf.data[inf.off + 2] == "-") {
	    inf.off += 3;
	    while (inf.off < inf.limit) {
		c = inf.data[inf.off++];

		if (c == "\n")
		    inf.linenum++;
		
		if (c == "-"
		    && inf.data[inf.off] == '-'
		    && inf.data[inf.off + 1] == '>') {
		    inf.off += 2;
		    break;
		}
	    }
	} else {
	    if (h5val.verbose >= 9)
		console.log ("getc = " + c);
	    return (c);
	}
    }
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
    switch (str) {
    case "lt": case "gt": case "amp": case "cent": case "pound": 
    case "yen": case "euro": case "sect": case "copy": case "reg": 
    case "trade": case "nbsp": case "quot": case "iquest":
    case "rsquo": case "lsquo":
    case "rdquo": case "ldquo":
	return (1);
    default:
	if (str[0] == "#")
	    return (1);
	return (0);
    }
}

h5val.regexp_ent = new RegExp ("^([-_a-zA-Z0-9#]+);");
h5val.regexp_tag = new RegExp ("^([-_a-zA-Z0-9]+)");

h5val.validate_entity = function (inf) {
    var s, parts, ent_name;

    s = inf.data.substr (inf.off, 10);
    parts = h5val.regexp_ent.exec (s);
    if (! parts)
	return "entity syntax error";
    ent_name = parts[1];
    inf.off += ent_name.length + 1;
    if (! h5val.valid_entity (ent_name))
	return "invalid entity " + ent_name;
    return null;
}

h5val.validate_children = function (indent, parent_tag, inf) {
    h5val.log (indent+"validate_children("+parent_tag+")");
    var s, part, ent_name, tag_name, r, tag, parts;
    while (1) {
	c = h5val.getc (inf);
	if (c == h5val.eof) {
	    return h5val.eof;
	} else if (c == "&") {
	    r = h5val.validate_entity (inf);
	    if (r)
		return (r);
	} else if (c == ">") {
	    return "unexpected greater-than";
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
    var doctype = new RegExp ("^(<!DOCTYPE [^>]*>)");
    var parts = doctype.exec (str);
    if (! parts)
	return "missing doctype";

    var inf = {};
    inf.data = str;
    inf.off = 0;
    inf.limit = str.length;
    inf.linenum = 1;

    /* discard DOCTYPE */
    while ((c = h5val.getc (inf)) != h5val.eof) {
	if (c == ">")
	    break;
    }

    var result = h5val.validate_children ("", null, inf);
    if (! result || result == h5val.eof)
	return null;

    h5val.verbose = 0;

    var ret = {};
    ret.linenum = inf.linenum;
    ret.summary = result;
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

    while ((c = h5val.getc (inf)) != h5val.eof) {
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
