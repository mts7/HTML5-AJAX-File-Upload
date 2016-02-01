/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
Converted to jQuery (somewhat) by Mike Rodarte - http://github.com/mts7
*/
(function() {
	// output information
	function output(msg) {
		$('#messages').append(msg);
	}


	// file drag hover
	function fileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == 'dragover' ? 'hover' : '');
	}


	// file selection
	function fileSelectHandler(e) {
		// cancel event and hover styling
		fileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			parseFile(f);
			uploadFile(f);
		}

	}


	// output file information
	function parseFile(file) {
		output(
			'<p>File information: <strong>' + file.name +
			'</strong> type: <strong>' + file.type +
			'</strong> size: <strong>' + file.size +
			'</strong> bytes</p>'
		);

		// display an image
		var reader = new FileReader();

		if (file.type.indexOf('image') == 0) {
			reader.onload = function(e) {
				output(
					'<p><strong>' + file.name + ':</strong><br />' +
					'<img src="' + e.target.result + '" /></p>'
				);
			};
			reader.readAsDataURL(file);
		}

		// display text
		if (file.type.indexOf('text') == 0) {
			reader.onload = function(e) {
				output(
					'<p><strong>' + file.name + ':</strong></p><pre>' +
					e.target.result.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
					'</pre>'
				);
			};
			reader.readAsText(file);
		}

	}


	// upload files
	function uploadFile(file) {
		var xhr = new XMLHttpRequest();
		if (xhr.upload && validFileType(file.type) && validFileSize(file.size)) {

			// create progress bar
			var o = $('#progress')[0];
			var progress = o.appendChild(document.createElement('p'));
			progress.appendChild(document.createTextNode('upload ' + file.name));


			// progress bar
			xhr.upload.addEventListener('progress', function (e) {
				var pc = parseInt(100 - (e.loaded / e.total * 100));
				progress.style.backgroundPosition = pc + '% 0';
			}, false);

			// file received/failed
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					progress.className = (xhr.status == 200 ? 'success' : 'failure');
				}
			};

			// start upload
			xhr.open('POST', $('#upload').prop('action'), true);
			xhr.setRequestHeader('X-FILENAME', file.name);
			xhr.send(file);
		}
	}


	// initialize
	function init() {
		// file select
		$('#fileselect').on('change', fileSelectHandler);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			$('#filedrag').on({
				dragover: function(e) {fileDragHover(e.originalEvent);},
				dragleave: function(e) {fileDragHover(e.originalEvent);},
				drop: function(e) {fileSelectHandler(e.originalEvent);}
			}).show();

			// remove submit button
			$('#submitbutton').hide();
		}

	}


	function validFileType(type) {
		return true | type.length;
	}


	function validFileSize(size) {
		return true | size > 0;
	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		init();
	}


})();