$(document).ready(function() {
	var classPanel = "panel";
	var classPanelSplitVertical = "panel-split-vertical";
	var classPanelSplitHorizontal = "panel-split-horizontal";
	var classPanelDivider = "panel-divider";

	var dataPanelDividerOrigin = "panel-divider-origin";
	var dataPanelDividerSizes = "panel-divider-sizes";

	var $dividerTarget = null;

	// When the page is resized, reset all panel sizes
	function bodyResized() {
		$("div." + classPanelSplitVertical + ", div." + classPanelSplitHorizontal + ", div." + classPanel)
			.css("width", "100%")
			.css("height", "100%");
	}

	function isBodyLandscape() {
		return ($("body").width() >= $("body").height());
	}

	function addPanelFunctionality() {
		// Add context menu functionality
		$(this)
			.on(
				"contextmenu",
				{title: "Pane Above", callback: panelSplit.bind($(this), 0, 0)},
				addContextMenuOption
			).on(
				"contextmenu",
				{title: "Pane Below", callback: panelSplit.bind($(this), 0, 1)},
				addContextMenuOption
			).on(
				"contextmenu",
				{title: "Pane Right", callback: panelSplit.bind($(this), 1, 1)},
				addContextMenuOption
			).on(
				"contextmenu",
				{title: "Pane Left", callback: panelSplit.bind($(this), 1, 0)},
				addContextMenuOption
			).on(
				"contextmenu",
				{title: "Close Pane", callback: panelClose.bind($(this))},
				addContextMenuOption
			).on(
  				"contextmenu", // click for timer
  				{ title: "Timer", callback: function() {
					addTimerTab.call($(this));
				}},
  				addContextMenuOption
			);

		// Add resizing functionality
		$(this).siblings("div." + classPanelDivider)
			.off("mousedown")
			.on("mousedown", panelDividerSelect);

		// Add a working tab bar to the panel
		$(this).each(addTabBarToPanel);
	}

	function panelClose() {
		var dimension = $(this).parent().hasClass(classPanelSplitVertical) ? "width" : "height";

		// The desired selection
		var desiredClass = 
			"div." + classPanel +
			", div." + classPanelSplitVertical +
			", div." + classPanelSplitHorizontal;

		// Select the other region to save
		var $otherSide = $(this).siblings(desiredClass).first();

		// Find another panel to combine tabs with
		var $otherPanel = 
			$otherSide.hasClass(classPanel) ? $otherSide : $otherSide.find("div." + classPanel).first();

		// Combine the tab bars of the two panels
		tabBarCombine(
			$otherPanel.children("div." + classTabBar).first(),
			$(this).children("div." + classTabBar).first()
		);
		
		// Tell all other panels to resize to accommodate new layout
		$(this).parent().find(desiredClass).css(dimension, "100%");

		// Send the other region to be before the parent, before removing the
		// parent
		$(this).parent()
			.before($otherSide)
			.remove();
	}

	function panelDividerMove() {
		if ($dividerTarget == null)
			return;

		// Override dimension target if on mobile
		var dimension = ($dividerTarget.parent().hasClass(classPanelSplitVertical) && isBodyLandscape()) ? "width" : "height";

		// Get the offset of the mouse from the divider
		var mouseOffset = (dimension == "width" ? event.pageX : event.pageY) - $dividerTarget.data(dataPanelDividerOrigin);

		// console.log(isBodyLandscape());

		// Resize the two panels
		$dividerTarget
			.prev()
				.css(dimension, `${$dividerTarget.data(dataPanelDividerSizes)[0] + mouseOffset}px`)
			.end()
			.next()
				.css(dimension, `${$dividerTarget.data(dataPanelDividerSizes)[1] - mouseOffset}px`);
	}

	function panelDividerDeselect() {
		if ($dividerTarget == null)
			return;

		// Reset the drag data of the divider
		$dividerTarget
			.data(dataPanelDividerOrigin, undefined)
			.data(dataPanelDividerSizes, undefined);

		// Unset the divider target
		$dividerTarget = null;
	}

	function panelDividerSelect() {
		if ($dividerTarget != null)
			return;

		// Set the data of the divider
		// Override dimension target if on mobile
		if ($(this).parent().hasClass(classPanelSplitVertical) && isBodyLandscape())
			$(this)
				.data(dataPanelDividerOrigin, $(this).offset().left)
				.data(dataPanelDividerSizes, [$(this).prev().width(), $(this).next().width()]);
		else
			$(this)
				.data(dataPanelDividerOrigin, $(this).offset().top)
				.data(dataPanelDividerSizes, [$(this).prev().height(), $(this).next().height()]);

		// Target the divider
		$dividerTarget = $(this);

	}

	function panelSplit(splitType, direction) {
		// Save the dimension to split in
		var dimension = splitType ? "height" : "width";
		// Save the size of the current panel on that dimension
		var size = (dimension == "height" ? $(this).height() : $(this).width());

		// Explicitly set the side of the panel on the other side of the divider
		$(this).siblings("div." + classPanel).first()
			.each(function() { $(this).css(dimension, $(this).css(dimension)); });

		// Create the new panel
		var $newPanel = 
			$("<div>")
				.addClass(classPanel);

		// Create the new panel divider
		var $newDivider = $("<div>").addClass(classPanelDivider);

		// Add a new panel splitter after the current panel before adding the
		// current panel to it
		$(this)
			.css("width", "100%")	// Reset the height & width to fill the panel split
			.css("height", "100%")	// 
		if (direction) {
			$(this)
				.after(
					$("<div>")
						.addClass(						//
							splitType ?					//
							classPanelSplitVertical : 	//
							classPanelSplitHorizontal)	// Argument data dictates split orientation
						.append($newDivider)			// Append the new divider
						.append($newPanel)				// Append the new panel
						.css(dimension, size)			// Set the size of the new panel split along the selected dimension
				).prependTo($(this).next());			// Prepend the current panel to the new split
		} else {
			$(this)
				.after(
					$("<div>")
						.addClass(						//
							splitType ?					//
							classPanelSplitVertical : 	//
							classPanelSplitHorizontal)	// Argument data dictates split orientation
						.append($newDivider)			// Append the new divider
						.prepend($newPanel)				// Prepend the new panel
						.css(dimension, size)			// Set the size of the new panel split along the selected dimension
				).appendTo($(this).next());				// Append the current panel to the new split
		}

		// Add all functionality to the new panel
		$newPanel.each(addPanelFunctionality);
	}

	$("div." + classPanel).each(addPanelFunctionality);

	$(document)
		.on("mouseup", panelDividerDeselect)
		.on("mousemove", panelDividerMove);

	$(window).on("resize", bodyResized);
});