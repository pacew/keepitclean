var h5val = {};
h5val.verbose = 0;
h5val.eof = [ "eof" ];
h5val.has_children = [ "has_children" ];

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
	    return (c);
	}
    }
}

h5val.peekc = function (inf) {
    if (inf.off >= inf.limit)
	return (h5val.eof);
    return (inf.data[inf.off]);
}

h5val.ungetc = function (c, inf) {
    if (inf.off > 0)
	inf.off--;
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

h5val.validate_children = function (indent, parent_tag_info, inf) {
    var s, part, ent_name, tag_name, r, tag_info, parts;
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
		inf.off += tag_name.length;
		c = h5val.getc (inf);
		if (c != ">") {
		    return ("close tag syntax error:"
			    + "junk before final greater-than");
		}
		if (parent_tag_info.name != tag_name) {
		    return ("incorrect close tag: got "
			    + tag_name + "; expected " + parent_tag_info.name);
		}
		return null;
	    }

	    s = inf.data.substr (inf.off, 20);
	    parts = h5val.regexp_tag.exec (s);
	    if (! parts)
		return "tag syntax error";
	    tag_name = parts[1];
	    inf.off += tag_name.length;

	    tag_info = h5val.tags[tag_name];

	    if (tag_info == null)
		return "unknown tag " + tag_name;
	    
	    if (parent_tag_info
		&& parent_tag_info.may_contain_blocks == 0
		&& tag_info.block == 1) {
		return "illegal block inside inline " + tag_name;
	    }
	    
	    r = h5val.validate_tag (indent, tag_info, inf);
	    if (r)
		return r;
	}
    }
    return (null);
}

/* we've read the less than and the tag name; now soak up attrs */
h5val.validate_tag = function (indent, tag_info, inf) {
    var r, c;
    var attrs = [];
    var attrname, attrval;
    var in_quotes;

    if (h5val.verbose) {
	h5val.log (indent + "validate_tag(" + tag_info.name + ")");
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
			h5val.ungetc (c, inf);
			break;
		    } else if (! h5val.isid[c]) {
			return "bad char in attrval";
		    }
		    
		    attrval += c;
		}
	    } else {
		h5val.ungetc (c, inf);
	    }

	    if (h5val.verbose)
		h5val.log (indent + "got attr " + attrname + " = " + attrval);

	} else if (c == "/") {
	    c = h5val.getc (inf);
	    if (c != ">")
		return "self-close syntax error " + tag_name;
	    r = h5val.validate_attrs (tag_info, attrs);
	    if (r == h5val.has_children)
		return null;
	    return r;
	} else if (c == ">") {
	    r = h5val.validate_attrs (tag_info, attrs);
	    if (r == h5val.has_children) {
		r = h5val.validate_children (indent, tag_info, inf);
		if (r == h5val.eof)
		    return "unexpected eof looking for end of " + tag_name;
		return r;
	    }
	}
    }
}

h5val.tags = [];

h5val.mktags = function (str, block, may_contain_block) {
    var arr = str.split (" ");
    for (var i = 0; i < arr.length; i++) {
	var tag = arr[i];
	h5val.tags[tag] = {
	    "name": tag,
	    "block": block,
	    "may_contain_block": may_contain_block
	};
    }
}

/* blocks that can contain blocks */
h5val.mktags ("html head meta link title body div form", 1, 1);
h5val.mktags ("fieldset ul li", 1, 1);

/* blocks that can't contain other blocks */
h5val.mktags ("p h1 h2 h3 h4 h5 h6 label br hr script", 1, 0);

/* inlines */
h5val.mktags ("a span input", 0, 0);

/*
h5val.mktags ("dd dt tt i b u s strike big small em strong dfn code samp");
h5val.mktags ("kbd var cite acronym abbr sub sup bdo center address noframes");
h5val.mktags ("wbr noscript noembed header footer article aside section");
h5val.mktags ("nav figure figcaption mark ruby rt rp a applet audio area");
h5val.mktags ("base basefont body br button canvas dir div dl embed fieldset");
h5val.mktags ("font form frame frameset head h1 h2 h3 h4 h5 h6 html hr iframe");
h5val.mktags ("img input keygen label li link map menu meta del ins object ol");
h5val.mktags ("optgroup option output p param pre plaintext q blockquote");
h5val.mktags ("script select source span style table caption td th col");
h5val.mktags ("colgroup tr tfoot thead tbody textarea time title track");
h5val.mktags ("ul bgsound isindex bq nextid multicol spacer  noframes video");
*/


h5val.validate_attrs = function (tag_info, attrs) {
    return h5val.has_children;
}

h5val.validate = function (str) {
    var doctype = new RegExp ("^(<!DOCTYPE [^>]*>)");
    var parts = doctype.exec (str);
    if (! parts)
	return "missing doctype";

    var inf = {};
    inf.data = str.substr (parts[1].length);
    inf.off = 0;
    inf.limit = str.length;
    inf.linenum = 1;

    var result = h5val.validate_children ("", null, inf);
    if (result && result != h5val.eof) {
	result = "line:" + inf.linenum + ": " + result;
    } else {
	result = null;
    }

    return (result);
}

/* for testing under command line node.js */
if (typeof exports != "undefined") {
    exports.validate = h5val.validate;
}

