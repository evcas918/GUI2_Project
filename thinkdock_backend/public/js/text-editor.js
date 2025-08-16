function addTextEditorTab() {
	var $textEditorEl = $("<textarea>")
		.attr("placeholder",  "Type Here")
		.attr("spellcheck",  false);

	addTab($(this), "Text Editor", $textEditorEl);
}

$(document).ready(function() {
	console.log("ready!");
});