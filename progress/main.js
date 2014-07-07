
// var patchAppendStream = function(){

// 	var old_append_stream = IPython.OutputArea.prototype.append_stream;

// 	IPython.OutputArea.prototype.append_stream = function(json) {
// 		if (json.text !== undefined) {
// 			json.text = parseOutputText(json.text,this); 
// 		}
// 		old_append_stream.call(this,json);
// 	};

// 	console.log("append_stream patched");
// };

// var parseOutputText = function(text,output_area) {
// 	//search for PROG(<prog>) which must be in a new line
// 	//ignores everything after ) until end of line
// 	var re = /^\s*PROG\(.*?\)\s*\n?/mg;
// 	var m = text.match(re);
// 	if (m !== null) {
// 		for (var i=0; i < m.length; i++) {
// 			var prog = parseFloat(m[i].split(/[()]/,2)[1]);
// 			if (prog===prog) { //ie, is not NaN
// 				setProgress(prog,output_area);
// 			}
// 		}
// 		//remove progress lines from output
// 		text = text.replace(re,"");
// 	}
// 	return text;
// };

var patchHandleOutput = function() {

	var old_handle_output = IPython.OutputArea.prototype.handle_output;

	IPython.OutputArea.prototype.handle_output = function(msg) {
		//check if message has metadata.progress property to see if it is our
		//custom message. If it is call setProgress and return
		if (msg.msg_type === "display_data" && msg.content.metadata.progress !== undefined) {
			var prog = msg.content.metadata.progress
			if (prog === prog) {//check that it is not NaN
				setProgress(prog,this);
			}
		
		} else { //if regular message, continue	with old function
			
			return old_handle_output.call(this,msg);
		
		}		


	};

	console.log("append_javascript patched");
}

var setProgress = function(prog,output_area) {
	
	if (prog < 0) prog = 0;
	if (prog > 1) prog = 1;

	console.log("Setting progress at " + prog);

	output_area._progress = prog;

	var progElem = output_area.element.find('progress');
	if (progElem.length === 0) {
		progElem = $(add_progress_bar(output_area.element));
	}

	if (progElem.length === 1) {
		progElem.attr('value',prog);	
	} else {
		throw "Got more than one progress elements in output area!"
	}

	$([IPython.events]).trigger('progress.updated');
};

var updateProgressEverywhere = function(resetProg) {
	var prog;
	var cells = IPython.notebook.get_cells();
	$(cells).each(function() {
		if (this.output_area) {
			prog = this.output_area._progress;

			for (var i=0; i < this.output_area.outputs; i++) {
				var md = this.output_area.outputs[i]
			}
		} 
		if (prog === undefined || resetProg === true) prog = 1;
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

var add_progress_bar = function(div, cell) {
  var progbar = $('<progress/>')
	.css({
		'width': "300px",
	})
	.attr("max",1);
  if (cell)
  	progbar.attr("value",cell.metadata.progress);

  div.prepend(
  	$('<div class="output_area"/>')
  	.append($('<div class="prompt"/>'))
  	.append($('<div class="subarea output_text output_stream output_stdout"/>')
  		.append(progbar)
  	)
  );

  return progbar;
};

CellToolbar.register_callback('progress.show', add_progress_bar);
CellToolbar.register_preset('Progress Bar', ['progress.show']);

// patchAppendStream();
patchHandleOutput(); 	
$([IPython.events]).on('progress.updated',updateProgressEverywhere);
//$([IPython.events]).on('status_idle.Kernel', resetProgressEverywhere);
// $([IPython.events]).on('status_idle.Kernel', resetProgressEverywhere);

var injectPythonCode = function() {
	$.get('/static/custom/progress/progress.py',function(data) {
		var py_code = data;


		var kernel = IPython.notebook.kernel;
		var _execute = function() {
	 		console.log("injecting python code");
	 		console.log(py_code);

			kernel.execute(py_code,{},{
			  'silent':false,'store_history':false
			});
		};
		// _execute();
		//must wait for the websockets to open before calling kernel.execute
		var websocket = IPython.notebook.kernel.shell_channel
		if (websocket.readyState === 1) {
			_execute();
		} else {
			websocket.onopen = _execute;
		}

	});

}

$([IPython.events]).on('status_started.Kernel',injectPythonCode);

var add_progress_bar_to_outputArea = function() {

}