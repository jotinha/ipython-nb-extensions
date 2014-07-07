var patchHandleOutput = function() {

	var old_handle_output = IPython.OutputArea.prototype.handle_output;

	IPython.OutputArea.prototype.handle_output = function(msg) {
		//check if message has metadata.progress property to see if it is our
		//custom message. If it is call setProgress and return
		if (msg.msg_type === "display_data" && msg.content.data['text/plain'] === "'MSG'") {

			switch (msg.content.metadata.type) {
				case 'setCellProgress':
					setProgress(msg.content.metadata.data,this);
					break;
				case 'addCellProgress':
					addProgress(msg.content.metadata.data,this);
					break;
				default:
					throw "invalid msg type: " + msg.content.metadata.type;
			}

		} else { //if regular message, continue	with old function
			
			return old_handle_output.call(this,msg);
		
		}		
	};

	console.log("handle_output patched");
}

var addProgress = function(delta,output_area) {
	delta = parseFloat(delta);
	if (delta === delta) { //check that it it is not NaN
		setProgress(delta + (output_area._progress || 0),output_area);
	}
}

var setProgress = function(prog,output_area) {
	
	prog = parseFloat(prog);

	if (prog === prog) {
		if (prog < 0) prog = 0;
		if (prog > 1) prog = 1;

		console.log("Setting progress at " + prog);

		output_area._progress = prog;

		var progElem = output_area.element.find('#outputProgress');
		if (progElem.length === 0) {
			progElem = $(add_progress_bar(output_area.element));
		}

		if (progElem.length === 1) {
			progElem.attr('value',prog);	
		} else {
			throw "Got more than one #outputProgress elements in output area!"
		}

		$([IPython.events]).trigger('progress.updated');
	}
};

var add_progress_bar = function(div) {
  var progbar = $('<progress/>')
  	.attr('id','outputProgress')
	.attr('max',1)
	.css({
		'width': "100%",
		'display': "block",
	})

  //add to top
  div.prepend(
  	$('<div class="output_area"/>')
  	.append($('<div class="prompt"/>'))
  	.append($('<div class="output_subarea output_html"/>')
  		.append(progbar)
  	)
  );

  return progbar;
};

var deleteAllProgress = function() {
	$(IPython.notebook.get_cells()).each(function() {
        if (this.output_area && this.output_area._progress !== undefined) {
            
            setProgress(1,this.output_area);

            this.output_area._progress = undefined;
        }
	});
}

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

$([IPython.events]).on('status_idle.Kernel', deleteAllProgress);
$([IPython.events]).on('status_started.Kernel',injectPythonCode);
patchHandleOutput(); 	
