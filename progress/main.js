var patchAppendStream = function(){

	var old_append_stream = IPython.OutputArea.prototype.append_stream;

	IPython.OutputArea.prototype.append_stream = function(json) {
		if (json.text !== undefined) {
			json.text = parseOutputText(json.text,this); 
		}
		old_append_stream.call(this,json);
	};

	console.log("append_stream patched");
};

var parseOutputText = function(text,output_area) {
	//search for PROG(<prog>) which must be in a new line
	//ignores everything after ) until end of line
	var re = /^\s*PROG\(.*?\)\s*\n?/mg;
	var m = text.match(re);
	if (m !== null) {
		for (var i=0; i < m.length; i++) {
			var prog = parseFloat(m[i].split(/[()]/,2)[1]);
			if (prog===prog) { //ie, is not NaN
				setProgress(prog,output_area);
			}
		}
		//remove progress lines from output
		text = text.replace(re,"");
	}
	return text;
};

var setProgress = function(prog,output_area) {
	
	if (prog < 0) prog = 0;
	if (prog > 100) prog = 100;

	console.log("Setting progress at " + prog);

	output_area._progress = prog;
	$([IPython.events]).trigger('progress.updated');
};

var updateProgressEverywhere = function(resetProg) {
	var prog;
	var cells = IPython.notebook.get_cells();
	$(cells).each(function() {
		if (this.output_area) {
			prog = this.output_area._progress;
		} 
		if (prog === undefined || resetProg === true) prog = 100;
		this.metadata.progress = prog;
	});
	redrawProgress();
};

var resetProgressEverywhere = function() {
	updateProgressEverywhere(true);
};

var redrawProgress = function() {
	$(IPython.notebook.get_cells()).each(function() {
		var ctb = this.element.find('.celltoolbar');

		if (ctb !== undefined && ctb.length === 1) {
			var progbar = ctb.find('progress');
			progbar.attr('value',this.metadata.progress);
		}
	});
};

var CellToolbar = IPython.CellToolbar;

// var raw_edit = function(cell){
//     IPython.dialog.edit_metadata(cell.metadata, function (md) {
//         cell.metadata = md;
//     });
// };


var add_progress_bar = function(div, cell) {
	var prog
    var progbar = $('<progress/>')
		.css({
			'width': "200px",
		})
		.attr("max",100)
		.attr("value",cell.metadata.progress);
    div.append(progbar);
};

CellToolbar.register_callback('progress.show', add_progress_bar);
CellToolbar.register_preset('Progress Bar', ['progress.show']);

patchAppendStream();
$([IPython.events]).on('progress.updated',updateProgressEverywhere);
$([IPython.events]).on('status_idle.Kernel', resetProgressEverywhere);





