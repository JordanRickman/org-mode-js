var Node = require("./node.js").Node;

var HtmlTextConverter = {
  convertDocument: function (doc) {
    var title = doc.title ? this.convertNode(doc.title) : "untitled";

    return "<h1>" + title + "</h1>\n"
      + this.convertNodes(doc.nodes);
  },

  convertNode: function (node) {
    var childText = node.children ? this.convertNodes(node.children) : "";
    var text;

    switch (node.type) {
    case Node.types.text:
      text = this.escapeTags(node.value);
      break;
    case Node.types.header:
      var level = node.level + 1;
      text = "<h" + level  + ">" + childText + "</h" + level  + ">\n";
      break;
    case Node.types.orderedList:
      text = "<ol>\n" + childText + "</ol>\n";
      break;
    case Node.types.unorderedList:
      text = "<ul>\n" + childText + "</ul>\n";
      break;
    case Node.types.definitionList:
      text = "<dl>\n" + childText + "</dl>\n";
      break;
    case Node.types.listElement:
      if (node.isDefinitionList) {
        var termText = this.convertNodes(node.term);
        text =
          "<dt>" + termText + "</dt>" +
          "<dd>" + childText + "</dd>\n";
      } else {
        text = "<li>" + childText + "</li>\n";
      }
      break;
    case Node.types.paragraph:
      text = "<p>" + childText + "</p>\n";
      break;
    case Node.types.preformatted:
      text = "<pre>" + childText + "</pre>\n";
      break;
    case Node.types.table:
      // TODO: Consider <col> or <colgroup>
      text = "<table>\n<tbody>\n" + childText + "</tbody>\n</table>\n";
      break;
    case Node.types.tableRow:
      text = "<tr>" + childText + "</tr>\n";
      break;
    case Node.types.tableCell:
      if (node.isHeader)
        text = "<th>" + childText + "</th>\n";
      else
        text = "<td>" + childText + "</td>";
      break;
    case Node.types.horizontalRule:
      text = "<hr />\n";
      break;
      // ============================================================ //
      // Inline
      // ============================================================ //
    case Node.types.inlineContainer:
      text = childText;
      break;
    case Node.types.bold:
      text = "<b>" + childText + "</b>";
      break;
    case Node.types.italic:
      text = "<i>" + childText + "</i>";
      break;
    case Node.types.underline:
      text = "<span style='text-decoration:underline;'>" + childText + "</span>";
      break;
    case Node.types.code:
      text = "<code>" + childText + "</code>";
      break;
    case Node.types.dashed:
      text = "<del>" + childText + "</del>";
      break;
    case Node.types.link:
      if (this.imageExtensionPattern.exec(node.src))
        text = "<img src=\"" + node.src + "\" alt=\"" + childText + "\"/>"; // TODO: escape childText
      else
        text = "<a href=\"" + node.src + "\">" + childText + "</a>";
      break;
    }

    return text;
  },

  convertNodes: function (nodes) {
    return nodes.map(this.convertNode.bind(this)).join("");
  },

  escapeTags: function (text) {
    return text.replace(/[&<>"']/g, function (matched) {
      return "&#" + matched.charCodeAt(0) + ';';
    });
  },

  imageExtensionPattern: new RegExp("(" + [
    "bmp", "png", "jpeg", "jpg", "gif", "tiff",
    "tif", "xbm", "xpm", "pbm", "pgm", "ppm"
  ].join("|") + ")$")
};

if (typeof exports !== "undefined")
  exports.HtmlTextConverter = HtmlTextConverter;