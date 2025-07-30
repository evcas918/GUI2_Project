var dataIsOpen = "isOpen";

/*
 * Toggle the sidebar when the hamburger menu is clicked
 */
function sidebarToggle() {
	let animationDuration = 187.5;

	// If the side bar is not open, then open it 
	if (! $(this).data(dataIsOpen)) {
		$(this)
			.parent().animate({left: 0}, animationDuration).end()
			.data(dataIsOpen, true)
	} else { // Otherwise close it
		$(this).parent().animate({left: -$(this).parent().width()}, animationDuration).end()
		.data(dataIsOpen, false);
	}
}

$(document).ready(function() {
	var classButtonSidebar = "button-sidebar";

	$("div." + classButtonSidebar)
		.data(dataIsOpen, false)
		.on("click", sidebarToggle);
}); 
