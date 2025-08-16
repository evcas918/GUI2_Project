function addImage() {
	var $panel = $(this).parent();

	// Create the file input button and give it a change callback
	var $input = $("<input>")
	  .attr("type", "file")
	  .attr("accept", "image/png, image/jpeg, image/jpg, image/webp")
	  .on("change", function(e) {

	  	 // Open the file
		 var reader = new FileReader();
		 reader.readAsDataURL(e.target.files[0]);

		 // When the file is loaded
		 reader.onload = e => {
		 	// Convert it to an image
			var image = new Image();
			image.src = e.target.result;

			// When the image is loaded
			image.onload = function() {
				// Scale it to have a maximum dimension of 360 pixels
				const maxDimension = 360;
				var dimension = (this.width > this.height) ? this.width : this.height;
				var imgScale = 1;
				if (dimension > maxDimension)
				  imgScale = maxDimension / this.width;

				// Create a new div with the image as its background
				var $imgDisplay = $("<div>")
				  .css("background-image", `url(${this.src})`)
				  .width(this.width * imgScale)
				  .height(this.height * imgScale)
				  .css("background-size", `${this.width * imgScale}px ${this.height * imgScale}px`);

				// Append the div to the tab
				$panel.append($imgDisplay);
			}

		 }
	  });

	 $input.click();
}

function addImageBoardTab() {
	var $textEditorEl = $("<div>")
		.addClass("button-image-add")
		// .height(buttonSize)
		// .width(buttonSize)
		// .css("background-color", "red")
		// .css("float", "right")
		.on("click", addImage);

	addTab($(this), "Image Board", $textEditorEl);
}