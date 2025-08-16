function addBookmarkButtonToTabBar($tabBar) {
    if ($tabBar.children("#tab-bookmark-arrow").length) return;

    const $arrow = $("<button>")
        .attr("id", "tab-bookmark-arrow")
        .text("►");

    $tabBar.append($arrow);
}

$(document).ready(() => {
    const $dropdown = $("<div>").attr("id", "bookmark-dropdown").appendTo("body");

    const $addEntry = $("<div>")
        .addClass("bookmark-entry add-bookmark")
        .text("Add Bookmark")
        .appendTo($dropdown)
        .on("click", (e) => {
            e.stopPropagation();

            // Only allow one input at a time
            if ($dropdown.find(".bookmark-input").length === 0) {
                const $input = $("<input>")
                    .attr("type", "text")
                    .attr("placeholder", "Enter bookmark URL")
                    .addClass("bookmark-input")
                    .appendTo($dropdown)
                    .focus();

            $input.on("keypress", function (e) {
        if (e.key === "Enter") {
            let url = $(this).val().trim();
            if (!url) return;

            if (!/^https?:\/\//.test(url)) url = "https://" + url;

            try {
                const parsed = new URL(url);
                const hostname = parsed.hostname;
                const parts = hostname.split(".");
                const tld = parts[parts.length - 1];
                if (parts.length < 2 || tld.length < 2) {
                    showInvalidUrlMessage($(this));
                    return;
                }
            } catch {
                showInvalidUrlMessage($(this));
                return;
            }
            addBookmarkToDropdown(url);
            $(this).remove();
        }   
});

// Remove the error message if user starts typing again
$input.on("input", function () {
    $(this).siblings(".invalid-url-msg").remove();
});

// Function to show a small error message below the input
function showInvalidUrlMessage($input) {
    $input.siblings(".invalid-url-msg").remove(); // remove previous message
    $("<div>")
        .addClass("invalid-url-msg")
        .text("Please enter a valid URL")
        .css({
            color: "red",
            fontSize: "0.7rem",
            marginTop: "2px"
        })
        .insertAfter($input);
    }
    }
        });

   function addBookmarkToDropdown(url) {
    const displayName = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    const $bookmark = $("<div>")
        .addClass("bookmark-entry")
        .appendTo($dropdown);

    // Clickable link
    const $link = $("<span>")
        .text(displayName)
        .appendTo($bookmark)
        .on("click", () => window.open(url, "_blank"));

    // Remove button
    const $remove = $("<span>")
        .addClass("bookmark-remove")
        .text("×")
        .appendTo($bookmark)
        .on("click", (e) => {
            e.stopPropagation(); // prevent dropdown close
            $bookmark.remove();   // remove this bookmark
        });
}

    // Toggle dropdown on arrow click
    $(document).on("click", "#tab-bookmark-arrow", function (e) {
        e.stopPropagation();
        const offset = $(this).offset();
        $dropdown.css({
            top: offset.top + $(this).outerHeight(),
            left: offset.left - $dropdown.outerWidth() + $(this).outerWidth()
        }).toggle();
    });

    // Hide dropdown when clicking outside
    $(document).on("click", () => $dropdown.hide());
    $dropdown.on("click", (e) => e.stopPropagation());
});