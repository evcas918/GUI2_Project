var classContextMenu = "context-menu";
var classContextMenuOption = "context-menu-option";

var $contextMenu = null;

function addContextMenuOption(event) {
	if ($contextMenu == null)
		return;

	// Add the option and add click functionality
	$contextMenu.append(
		$("<div>")
			.addClass(classContextMenuOption)
			.html(event.data.title)
			.on("click", event.data.callback)
	);
}

function showContextMenu() {
	if ($contextMenu == null)
		return; 

	// Set the position of the context menu to where the cursor is
	$contextMenu
		.css("top", event.pageY)
		.css("left", event.pageX);

	// If the context menu is already showing then hide it
	if ($contextMenu.parent().is($("body")))
		hideContextMenu();
	// Otherwise reattach the context menu to the body to be displayed
	else
		$("body").append($contextMenu);
}

function hideContextMenu() {
	if ($contextMenu == null)
		return; 

	// Remove all available options to make way for new set
	$contextMenu.children("div." + classContextMenuOption).remove();

	// Detach the context menu to hide
	$contextMenu.detach();
}

$(document).ready(function () {
	function initContextMenu() {
		// Set the visibility of the custom context menu to visible
		$(this).css("visibility", "visible");

		// Detach it until it is needed
		$contextMenu = $(this).detach();
	}

	$("div." + classContextMenu).first()
		.each(initContextMenu);

	$(document)
		.on("contextmenu", false)
		// .on("contextmenu", {title: "Hello", callback: function() { console.log("Hello"); }}, addContextMenuOption)
		.on("contextmenu", showContextMenu)
		.on("click", hideContextMenu);
}); 
