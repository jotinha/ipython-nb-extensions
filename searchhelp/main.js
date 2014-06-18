(function() {
  var sendToPager = function(data) {
    $([IPython.events]).trigger('open_with_text.Pager', data);
  };

  var sendHelpQuery = function(query) {
    var callbacks = {
      'shell' : {
        'payload' : {
          'page' : sendToPager            
        },
        reply: function(data) { 
          //check if payload actually exists
          if (data.content.payload.length === 0) {
            //use this to handle invalid output!
          }
        },
      }
    };
    IPython.notebook.kernel.execute(query + '?',callbacks,{
      'silent':false,'store_history':false
    });
  };

  var createSearchBox = function() {

    el = $(
    '<form class="navbar-search pull-right" id="helpSearch">'+
    '   <input type="search" class="search-query" placeholder="Search help" id="searchField">'+
    '</form>'
    );

    $('#maintoolbar-container').append(el);

    $('#helpSearch').submit(function(event) {
      var query = $(this).find('#searchField').val();
      sendHelpQuery(query);
      
      event.preventDefault();
    });

    //this handles the disabling/enabling of shortcuts on focus in/out
    IPython.keyboard_manager.register_events($('#helpSearch'));  

    IPython.keyboard_manager.command_shortcuts.add_shortcuts({
      'shift-H': {
        handler: function(event) {
          $('#searchField').focus();
          return false;

        }
      }
    })
  };

  var addCSS = function() {
    $('head').append('<link rel="stylesheet" href=' + 
                      require.toUrl('custom/searchhelp/main.css') + 
                      ' />');
  };

  //addCSS();
  createSearchBox();

})();