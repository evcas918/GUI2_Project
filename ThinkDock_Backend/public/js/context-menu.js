var classContextMenu = "context-menu";
var classContextMenuOption = "context-menu-option";

var $contextMenu = null;

/**
 * Adds a context menu option with a function callback
 *
 * Simply bind this function to a desired objects contextmenu call, and pass the
 * object as the event. >>                                                    <<
 * >>                                                                         <<
 * >>  $("example")                                                           <<
 * >>        .on(                                                             <<
 * >>            "contextmenu",                                               <<
 * >>            {title: "My Option", callback: myCallBack},                  <<
 * >>            addContextMenuOption                                         <<
 * >>        );                                                               <<
 * >>                                                                         <<
 *
 * @param      {object}  event   The event containing the title of the option as
 *                               well as the callback function. >>            <<
 *                               layout: {title: "", callback: fn} >>         <<
 */	
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

/**
 * Shows the context menu.
 */
function showContextMenu() {
	if ($contextMenu == null)
		return; 


	// If the context menu is already showing then hide it
	if ($contextMenu.parent().is($("body"))) {
		hideContextMenu();
		return;
	}

	hideContextMenu();
	$("body").append($contextMenu);

	// // Set the position of the context menu to where the cursor is
	// $contextMenu
	// 	.css("top", event.pageY)
	// 	.css("left", event.pageX);
	
	// Calculate the position for the context menu
	var width_ = $contextMenu.css("min-width").replace(/\D/g,'');
	var left_ = $(this).offset().left + $(this).width() - width_;
	if (left_ - width_ < 0)
		left_ = 0;

	$contextMenu
		.css("top", $(this).offset().top + $(this).height())
		.css("left", left_);
}

/**
 * Hides the context menu.
 */
function hideContextMenu() {
	if ($contextMenu == null)
		return; 

	// Remove all available options to make way for new set
	$contextMenu.children("div." + classContextMenuOption).remove();

	// Detach the context menu to hide
	$contextMenu.detach();
}

$(document).ready(function () {
	/**
	 * Initializes the context menu and hides it
	 */
	function initContextMenu() {
		// Set the visibility of the custom context menu to visible
		$(this).css("visibility", "visible");

		// Detach it until it is needed
		$contextMenu = $(this).detach();
	}

	// Initialize the context menu
	$("div." + classContextMenu).first()
		.each(initContextMenu);

	$(document)
		// .on("contextmenu", false) 			// Block the system context menu from showing
		// .on("contextmenu", showContextMenu)	// Show the custom context menu on right-click
		.on("click", function(evt) {
			if ($(evt.target).hasClass("panel-context"))
				return;

			hideContextMenu();
		});		// Hide the context menu on left-click
}); 

$(document).on(
  "click",
  { title: "Calendar", callback: function () {
	 if (typeof addCalendarTab === "function") {
        addCalendarTab(); // Launch the calendar tab
      } else {
        console.error("addCalendarTab is not defined");
      }
  }},
  addContextMenuOption
);
