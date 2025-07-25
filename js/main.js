var classTabBar = "tab-bar";
var classTab = "tab";
var classGhostTab = "ghost-tab";
var classTabSelected = "tab-selected";
var classTabDocumentView = "tab-document-view";
var classTabDocument = "tab-document";

var dataInitialOffset = "initial-offset";
var dataParentIndex = "parent-index";
var dataLinkedDocument = "linked-document";

var $dragTarget = null;

/**
 * Insert a DOM element as a child at a specific index
 *
 * @param      {DOM element}  $dom    The dom
 * @param      {number}  index   The index
 */
$.fn.insertIndex = function ($dom, index) {
	index -= 1;
	// If this has no children then simply append the DOM
	if (this.children().length <= 0) {
		this.append($dom);
	}
	// Otherwise append at the correct index
	else {
		if (index < 0)
			this.children().eq(0).before($dom);
		else if (index > this.children().length - 1)
			this.children().eq(this.children().length - 1).after($dom);
		else
			this.children().eq(index).after($dom);
	}
}

/**
 * Check if a point is within the bounds of a block
 *
 * @param      {2-element array [y, x]}  pos     The position of the point
 * @param      {DOM element}             $block  The block to check for
 *                                               collisions
 * @return     {boolean}                 True if the point lies within the
 *                                       bounds, false otherwise
 */
function aabb(pos, $block) {
	return ( $block?.offset().left <= pos[1] && pos[1] <= $block?.offset().left + $block?.width() &&
		$block?.offset().top <= pos[0] && pos[0] <= $block?.offset().top + $block?.height() );
}

/**
 * Clear a tabs siblings from being selected
 */
function tabSiblingsClearSelection() {
	// Remove selection tab from all sibling tabs
	$(this)
		.siblings().removeClass(classTabSelected);

	// Hide the documents associated with all the sibling tabs
	$(this).parent().siblings("div." + classTabDocumentView)
		.children().first().detach();
}
/**
 * Make a tab selected
 */
function tabSelect() {
	// Add the selected tab class to the tab
	$(this)
		.addClass(classTabSelected);

	// Show the document associated with the tab	
	$(this).parent().siblings("div." + classTabDocumentView)
		.append($(this).data(dataLinkedDocument));
}

/*
 * Removes all ghost tabs from a tab bar
 *
 * @param      {DOM element}  $tabBar  The tab bar
 */
function removeAllGhostTabs($tabBar) {
	if ($tabBar == null)
		return;

	// Remove any tabs with the ghost tab class
	$tabBar.children("div." + classGhostTab).remove();
}

/**
 * Attempt to add a ghost tab to a tab bar
 *
 * @param      {DOM element}  $tabBar  The tab bar
 */
function attemptAddGhostTab($tabBar) {
	if ($tabBar == null)
		return;

	// Save any current ghost tabs to be deleted after generating a new one
	// Instead of removing all ghost tabs now, we have to do this in order to
	// keep the drag target aligned. If not, weird things happen when we click
	// on tabs
	$ghostTabs = $tabBar.children("div." + classGhostTab);

	// Find the tab that is closest to the drag target on the x-axis
	let $closestTab = null;
	let shortestDistance = Number.MAX_VALUE;
	$tabBar.children("div." + classTab).each(function() {
		let currentDistance = Math.abs(
			$(this).offset().left +
			($(this).width() * 0.5) -
			event.pageX); 

		if (currentDistance < shortestDistance) {
			shortestDistance = currentDistance;
			$closestTab = $(this);
		}
	});

	// If a closest tab has been found
	if ($closestTab != null) {
		// Place a ghost tab on whichever side of the tab that the drag target
		// is closest to
		let xFrac = (event.pageX - $closestTab.offset().left) / $closestTab.width();
		if (xFrac < 0.5)
			$closestTab.before($("<div>").addClass(classGhostTab).css("min-width", `${$dragTarget.width()}px`));
		else
			$closestTab.after($("<div>").addClass(classGhostTab).css("min-width", `${$dragTarget.width()}px`));
	}

	// Finally remove all the saved ghost tabs, leaving only the new one
	// remaining
	$ghostTabs.remove();
}

/*
 * Called once when a tab is selected to be dragged
 */
function dragTargetSelect() {
	if ($dragTarget != null)
		return;
		
	// Target the tab
	$dragTarget = $(this);

	// Get the initial offset of the tab
	let arrInitialOffset = [
		event.pageY - $dragTarget.offset().top,
		event.pageX - $dragTarget.offset().left
	];

	// Save the data about the parent: who is the parent & what is the index of
	// the element as its child
	let arrParentData = [
		$dragTarget.parent(),
		$dragTarget.index()
	];

	// Save the width of the tab
	let originalWidth = $dragTarget.width();

	// Attempt to add a ghost tab before we detach the tab. Again, if we dont do
	// this, weird things will happen when we click tabs
	attemptAddGhostTab($dragTarget.parent());

	// Detach the tab from the tab bar and set the position to absolute origin
	$dragTarget
		.detach()
		.appendTo("body")
		.css("position", "absolute")
		.css("top", "0px")
		.css("left", "0px")
		.css("width", `${originalWidth}px`)
		.css("z-index", "1");

	// Prepare the target
	$dragTarget
		.data(dataInitialOffset, arrInitialOffset)
		.data(dataParentIndex, arrParentData);

	// Call the move function once to align the position of the drag target
	dragTargetMove();
}

/*
 * Called once when a tab is deselected after being dragged
 */
function dragTargetDeselect() {
	if ($dragTarget == null)
		return;

	// Potential current tab bar information
	let arrParentData = [
		null,
		0
	];

	// Remove all ghost tabs saving information about the current tab bar if it
	// is being hovered over
	$("div." + classTabBar).each(function() {
		if (aabb([event.pageY, event.pageX], $(this))) {
			arrParentData[0] = $(this);
			arrParentData[1] = $(this).children("div." + classGhostTab).first().index();
		}

		removeAllGhostTabs($(this));
	});

	// Detach the current drag target	
	$dragTarget.detach();
	
	// If there drag target is not hovering over a tab bar then return it to its
	// original location
	if (arrParentData[0] == null) {
		$dragTarget.data(dataParentIndex)[0].insertIndex(
			$dragTarget,
			$dragTarget.data(dataParentIndex)[1]);
	}
	// Otherwise insert the tab into the new tab bar
	else {
		arrParentData[0].insertIndex(
			$dragTarget,
			arrParentData[1]);

		// If the tab bar is different
		if ($dragTarget.data(dataParentIndex)[0].is($dragTarget.parent()) == false) {
			// Select the first available tab on the old tab bar since none will
			// be selected
			tabSelect
				.call($dragTarget.data(dataParentIndex)[0].children("div." + classTab).first());
			
			// Run a tab select on the new bar in order to update the document view
			tabSelect
				.call($dragTarget);
		}
	}

	// Update the CSS to no longer be in a dragging state
	$dragTarget
		.css("position", "unset")
		.css("width", "unset");

	// Make sure that the drag target is the selected tab within its tab bar
	if ($dragTarget.data(dataParentIndex)[0].is($dragTarget.parent()) == false)
		tabSiblingsClearSelection.call($dragTarget);
	
	// Remove the tab from being targeted
	$dragTarget = null;
}

/*
 * Called continuously while a tab is being dragged
 */
function dragTargetMove() {
	if ($dragTarget == null)
		return;

	// Calculate the offset of the tab when following the mouse
	let offset = [
		event.pageY - $dragTarget.data(dataInitialOffset)[0],
		event.pageX - $dragTarget.data(dataInitialOffset)[1]
	];

	// Change the position of the tab to match that offset
	$dragTarget
		.css("top", `${offset[0]}px`)
		.css("left", `${offset[1]}px`);

	// Add a ghost tab wherever the mouse is hovering
	$("div." + classTabBar).each(function() {
		if (aabb([event.pageY, event.pageX], $(this)))
			attemptAddGhostTab($(this));
		else
			removeAllGhostTabs($(this));
	});
}

$(document).ready(function() {
	// Prepare all documents by detaching them
	$("div." + classTabDocument).each(function() {
		$(this).parent()
			.data(dataLinkedDocument, $(this).detach());
	});
	// Show all active documents
	$("div." + classTabSelected).each(function() {
		$(this).parent().siblings("div." + classTabDocumentView)
			.append($(this).data(dataLinkedDocument));
	});

	// Bind the mouse down functionality to the tabs themselves in order to be
	// selected
	$("div." + classTab)
		.bind("mousedown", tabSiblingsClearSelection)
		.bind("mousedown", tabSelect)
		.bind("mousedown", dragTargetSelect);

	// Bind all other mouse functionality to the entire document
	$(document)
		.bind("mouseup", dragTargetDeselect)
		.bind("mousemove", dragTargetMove);
});