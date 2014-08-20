
var setMainStatus = function() {
	var snw = IPython.notification_area.new_notification_widget('statusdetail');
	
	return function (status,timeout, click_callback) {

		if (status) {
			snw.set_message(status,timeout,click_callback);
		} else {
			snw.set_message('',0); // remove message
		}
	};
}();

var resetStatus = function() {

	setMainStatus(false);

};

var updateStatus = function() {
	
	var ccidx = 0;
	
	$.each(IPython.notebook.get_cells(), function(idx,cell) {
		
		//only count cell of type code
		if (cell.cell_type === 'code') {
			var ipn = cell.input_prompt_number;

			if (ipn === '*')  { //running

				var gotoCell = function() { 
					cell.element.get(0).scrollIntoView();
					IPython.notebook.select(idx); //use instead of cell.select which does not unselect others
					$([IPython.events]).trigger('running_cell_change.Notebook',[idx]);
					return false; 
				};
				
				//ccidx is zero-indexed, so use ccidx + 1
				setMainStatus('Running code cell #' + (ccidx+1),-1,gotoCell);
				return false;
			} 
			ccidx += 1;
		}
	});
	
};

$([IPython.events]).on('status_idle.Kernel', resetStatus);
$([IPython.events]).on('status_busy.Kernel', updateStatus);

