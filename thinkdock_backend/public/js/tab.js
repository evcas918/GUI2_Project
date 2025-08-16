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


const maxTabCount = 15;

var classTab = "tab";
var classTabTitle = "tab-title";
var classTabBar = "tab-bar";
var classGhostTab = "ghost-tab";
var classTabSelected = "tab-selected";
var classTabDocument = "tab-document";
var classTabDocumentView = "tab-document-view";
var classButtonTabAdd = "button-tab-add";
var classButtonTabClose = "button-tab-close";
var classIconAdd = "icon-add";
var classIconClose = "icon-close";

var dataInitialOffset = "initial-offset";
var dataParentIndex = "parent-index";
var dataLinkedDocument = "linked-document";
var dataIsClosing = "is-closing";


var classPanelContext = "panel-context";

var $dragTarget = null;

/**
 * Combine the tabs of two tab bars
 *
 * @param      {DOM element}  $retain  The tab bar which retains its tabs
 * @param      {DOM element}  $lose    The tab bar which loses its tabs
 */
function tabBarCombine($retain, $lose) {
	// Place the tabs before the tab button
	$retain.children("div." + classButtonTabAdd)
		.before(
			$lose.children("div." + classTab)
				.removeClass(classTabSelected)
		);
}

/**
 * Adds a tab bar to an empty panel
 */
function addTabBarToPanel() {
    if ($(this).children("div." + classTabBar).length > 0)
        return;

    // Create the tab bar as a variable
    const $tabBar = $("<div>")
        .addClass(classTabBar)
        .append(
            $("<div>")
                .addClass(classPanelContext)
                .on("click", showContextMenu)
        )
        .each(addTabBarFunctionality); // then add its functionality

    // Add the bookmark button
    addBookmarkButtonToTabBar($tabBar);

    // Append tab bar and document view to panel
    $(this)
        .append($tabBar)
        .append($("<div>").addClass(classTabDocumentView));
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
 * Add functionality to all selected tabs
 */
function addTabFunctionality() {
	// Prepare all documents by detaching them
	$(this).children("div." + classTabDocument).each(function() {
		$(this).parent()
			.data(dataLinkedDocument, $(this).detach());
	});
	// Show all active documents
	$(this).filter("div." + classTabSelected).each(function() {
		$(this).parent().siblings("div." + classTabDocumentView)
			.append($(this).data(dataLinkedDocument));
	});

	// Bind the mouse down functionality to the tabs themselves in order to be
	// selected
	$(this)
		.on("mousedown", checkForClosingEvent)		// If the mouse is over the closing button then prevent the tab from
		                                      		// being selected.
		.on("mousedown", tabSiblingsClearSelection)	// Unselect any other tabs in the tab bar.
		.on("mousedown", tabSelect)					// Select the tab by lighting it up.
		.on("mousedown", dragTargetSelect)			// Select the tab as a drag target (follow the mouse cursor).
		.on("mousedown", clearClosingEvent);		// If the tab was marked to be closed then reset that data in case
		                                    		// the user's cursor is dragged away from the close button.

	// When a tab's close button is successfully clicked, close the tab
	$(this).children("div." + classButtonTabClose)
		.on("click", closeTab);
}

/**
 * Clear a tabs siblings from being selected
 */
function tabSiblingsClearSelection() {
	// Return if the tab is in the process of being closed
	if ($(this).data(dataIsClosing))
		return

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
	// Do not select a tab that is in the process of being closed
	if ($(this).data(dataIsClosing))
		return

	// Add the selected tab class to the tab
	$(this)
		.addClass(classTabSelected);

	// Show the document associated with the tab	
	$(this).parent().siblings("div." + classTabDocumentView)
		.append($(this).data(dataLinkedDocument));
}

/**
 * Create a new tab
 *
 * @param      {string}       title   The title of the tab
 * @param      {DOM element}  $html   The html to place inside the new document
 *                                    associated with the tab
 * @return     {DOM element}  The tab itself
 */
function newTab(title, $html) {
	// Create the new document associated with the tab, placing the desired html
	// inside the new document
	$newDocument = 
		$("<div>")
			.addClass(classTabDocument)
			.append($html);

	// Create the new tab and associate it with the new document
	$newTab = 
		$("<div>")
			.addClass(classTab)
			.append(
				$("<div>")
					.addClass(classTabTitle)
					.append(title)
			).append(
				$("<div>")
					.addClass(classButtonTabClose)
					.append(
						$("<div>")
							.addClass(classIconClose)
					)
			).append($newDocument);

	// Add functionality to the tab
	$newTab.each(addTabFunctionality);

	// Return the tab
	return $newTab;
}

/**
 * Adds a tab to the current tab bar
 */
function addTabD() {
	if ($("div." + classTab).length >= maxTabCount) {
		alert("Too many tabs!");
		return;
	}

	// Create the new tab
	$newTab = newTab("New Tab", $("<textarea>")
		.attr("placeholder",  "Type Here")
		.attr("spellcheck",  false));

	// Insert it before the new tab button
	$(this).before($newTab);

	// Select the new tab
	tabSiblingsClearSelection.call($newTab);
	tabSelect.call($newTab);
}

function addTab($panel, title, $content) {
	// console.log($panel);
	// return;

	if ($("div." + classTab).length >= maxTabCount) {
		alert("Too many tabs!");
		return;
	}

	// Create the new tab
	$newTab = newTab(title, $content);

	// Insert it before the new tab button
	$panel.children("div." + classTabBar).first()
		.children("div." + classPanelContext).before($newTab);

	// Select the new tab
	tabSiblingsClearSelection.call($newTab);
	tabSelect.call($newTab);

	return $newTab;
}

/*
 * When called will add closing data to the current tab element to prevent a tab
 * from being selected if it is going to be closed
 */
function checkForClosingEvent() {
	// If the mouse is hovering over the closing button of the current tab then
	// raise the closing flag
	if (aabb([event.pageY, event.pageX], $(this).children("div." + classButtonTabClose).first()))
		$(this).data(dataIsClosing, true);
}

/*
 * Resets the closing data of a tab
 */
function clearClosingEvent() {
	$(this).data(dataIsClosing, false);	
}

/**
 * Closes a tab and selects its neighbor if possible
 */
function closeTab() {
	// Find the next tab to possibly select based on neighbors
	var $prev = $(this).parent().prev("div." + classTab);
	var $next = $(this).parent().next("div." + classTab);
	var $newSelected =
		$prev.length ? $prev : $next;

	// Get the tab bar which the current tab belongs to
	var $tabBar = $(this).parent().parent();

	// Remove the tab to be closed
	$(this).parent().remove();

	// If no tabs are currently selected
	if ($tabBar.children().hasClass(classTabSelected) == false) {
		// Clear the current document view
		$tabBar.siblings("div." + classTabDocumentView).children().remove();

		// If there is a tab available to be selcted then select it
		if ($newSelected.length == 1) {
			tabSiblingsClearSelection.call($newSelected);
			tabSelect.call($newSelected);
		}
	}

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
	// Do not select a null target or a tab that is in the process of being closed 
	if ($dragTarget != null || $(this).data(dataIsClosing))
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
			
			// Make sure that the drag target is the selected tab within its tab bar
			tabSiblingsClearSelection.call($dragTarget);

			// Run a tab select on the new bar in order to update the document view
			tabSelect
				.call($dragTarget);
		}
	}

	// Update the CSS to no longer be in a dragging state
	$dragTarget
		.css("position", "unset")
		.css("width", "unset");
	
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

/**
 * Adds functionality to the tab bar
 */
function addTabBarFunctionality() {
	// $(this).children("div." + classButtonTabAdd)
	// 	.on("click", addTabD);
}

$(document).ready(function() {
	// Add functionality to any tabs already included in the html
	$("div." + classTab).each(addTabFunctionality);

	// When the new tab button is successfully clicked, add a new tab
	// $("div." + classTabBar).each(addTabBarFunctionality);

	// Bind all other mouse functionality to the entire document
	$(document)
		.on("mouseup", dragTargetDeselect)
		.on("mousemove", dragTargetMove);

	functionAddTabBarFunctionality = addTabBarFunctionality;
});

/* ==== Workspace Snapshot/Restore Helpers ==== */
(function(){
  if (typeof window.classButtonTabAdd === "undefined") { window.classButtonTabAdd = "button-tab-add"; }

  function getTabTitle($tab){
    const t1 = $tab.find(".tab-title").first().text();
    if (t1 && t1.trim().length) return t1.trim();
    return ($tab.clone().children(".tab-close,.tab-icon").remove().end().text()||"").trim();
  }

  function getCurrentWorkspaceState(){
    const tabs = [];
    $(".tab").each(function(){
      const $tab = $(this);
      const panelId = $tab.data("panel-id");
      if (!panelId) return;
      const title = getTabTitle($tab);
      const $panel = $("#" + panelId);
      const html = $panel.length ? $panel.html() : "";
      tabs.push({title, panelId, content: html});
    });
    const activeTabIndex = $(".tab").index($(".tab.active"));
    return { schemaVersion:1, savedAt:new Date().toISOString(), tabs, activeTabIndex: activeTabIndex>=0?activeTabIndex:0 };
  }

  function clearWorkspacePreservingAddButton(){
    $(".tab").each(function(){ const $t=$(this); if($t.data("panel-id")) $t.remove(); });
    $(".panel-root .panel, .panel").remove();
  }

  function createPanel(panelId, html){
    let $panel = $("#" + panelId);
    if ($panel.length===0){
      $panel = $("<div>").addClass("panel").attr("id", panelId);
      if ($(".panel-root").length){ $(".panel-root").append($panel); } else { $("body").append($panel); }
    }
    $panel.html(html||"");
    return $panel;
  }

  function promptForName(defaultName){
    const name = window.prompt("Project name:", defaultName||"My Project");
    return name && name.trim().length ? name.trim() : null;
  }

  // Inline tab rename on double-click
  $(document).off("dblclick.renameTabs").on("dblclick.renameTabs", ".tab .tab-title, .tab", function(){
    const $tab = $(this).closest(".tab");
    if (!$tab.data("panel-id")) return;
    let $title = $tab.find(".tab-title").first();
    if ($title.length===0){
      const text = getTabTitle($tab) || "Untitled";
      $title = $("<span>").addClass("tab-title").text(text);
      $tab.prepend($title);
    }
    const currentText = $title.text().trim();
    const $input = $("<input>").val(currentText).css({width: Math.max(80,currentText.length*8)+"px"});
    $title.replaceWith($input); $input.focus().select();
    function commit(){ const t = ($input.val()||"").trim() || currentText; $input.replaceWith($("<span>").addClass("tab-title").text(t)); }
    $input.on("keydown", e=>{ if(e.key==="Enter") commit(); if(e.key==="Escape"){ $input.replaceWith($("<span>").addClass("tab-title").text(currentText)); }});
    $input.on("blur", commit);
  });

  // Expose
  window.getTabTitle = getTabTitle;
  window.getCurrentWorkspaceState = getCurrentWorkspaceState;
  window.clearWorkspacePreservingAddButton = clearWorkspacePreservingAddButton;
  window.createPanel = createPanel;
  window.promptForName = promptForName;
})();
