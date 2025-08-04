var Cloud = {
	/**
	 * Gets a specified file at a bucket url
	 *
	 * @param      {string}   bucketURL  The url of the server bucket
	 * @param      {string}   filePath   The file path
	 * @return     {promise}  The a promise of a file blob
	 */
	getFile: function(bucketURL, filePath) {
		return firebase.storage().refFromURL(bucketURL)
			.child(filePath).getDownloadURL()
				.then(url => {
					return fetch(url)
						.then(res => res.blob());
				});
	},

	/**
	 * Create or edit a file at a bucket url
	 *
	 * @param      {string}  bucketURL  The url of the server bucket
	 * @param      {string}  filePath   The file path
	 * @param      {Blob}    blob       The file blob to upload
	 */
	editFile: function(bucketURL, filePath, blob) {
		firebase.storage().refFromURL(bucketURL)
			.child(filePath).put(blob);
	},

	/**
	 * Delete a file at a bucket url
	 *
	 * @param      {string}  bucketURL  The url of the server bucket
	 * @param      {string}  filePath   The file path
	 */
	deleteFile: function(bucketURL, filePath) {
		firebase.storage().refFromURL(bucketURL)
			.child(filePath).delete();	
	}
}

/**
 * WRITE FILE EXAMPLE
 */
// const jsonData = {
// 	name: "Seth",
// 	value: 99
// };
// const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
// Cloud.editFile("gs://thinkdock-a48f9.firebasestorage.app", "test.json", jsonBlob);


/**
 * READ FILE EXAMPLE
 */
// Cloud.getFile("gs://thinkdock-a48f9.firebasestorage.app", "test.json")
// 	.then(jsonBlob => jsonBlob.text())
// 	.then(text => {
// 		console.log(text);
// 	});