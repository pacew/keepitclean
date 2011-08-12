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

h5val.unget = function (inf) {
    if (inf.off <= 0)
	return (h5val.elf);
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

/* roughly placed ... will need to refine */

/* blocks that can contain blocks */
h5val.mktags ("html head meta link title body div form", 1, 1);
h5val.mktags ("fieldset ul li dd noframes noscript noembed", 1, 1);
h5val.mktags ("header footer article aside section nav figure", 1, 1);
h5val.mktags ("figcaption mark ruby rt rp applet area", 1, 1);
h5val.mktags ("base basefont body dl embed fieldset form frame frameset", 1, 1);
h5val.mktags ("iframe li link map menu meta object ol", 1, 1);
h5val.mktags ("optgroup option output param script select source", 1, 1);
h5val.mktags ("style table caption td th col colgroup tr tfoot thead", 1, 1);
h5val.mktags ("tbody ul bgsound isindex multicol noframes", 1, 1);

/* blocks that can't contain other blocks */
h5val.mktags ("p h1 h2 h3 h4 h5 h6 label br hr dt center", 1, 0);
h5val.mktags ("blockquote textarea", 1, 0);

/* inlines */
h5val.mktags ("a span input tt i b u s strike big small em", 0, 0);
h5val.mktags ("strong dfn code samp kbd var cite acronym", 0, 0);
h5val.mktags ("abbr sub sup bdo address wbr br button canvas dir", 0, 0);
h5val.mktags ("font img input keygen label del ins pre plaintext q", 0, 0);
h5val.mktags ("time title track bq nextid spacer video audio", 0, 0);

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
    if (! result || result == h5val.eof)
	return null;

    result = "line:" + inf.linenum + ": " + result + "\n";

    var nlines = 3;

    end_linenum = inf.linenum;
    while ((c = h5val.unget (inf)) != h5val.eof) {
	if (end_linenum - inf.linenum >= nlines)
	    break;
    }
    
    result += "" + inf.linenum + ": ";

    while ((c = h5val.getc (inf)) != h5val.eof) {
	if (inf.linenum >= end_linenum)
	    break;
	if (c == "\n") {
	    result += "\n";
	    result += "" + inf.linenum + ": ";
	} else {
	    result += c;
	}
    }

    return (result);
}

/* for testing under command line node.js */
if (typeof exports != "undefined") {
    exports.validate = h5val.validate;
}

