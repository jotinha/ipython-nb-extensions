var createTOC = function() {

  var el = $(
    '<div class="container" id="toc">' + 
    '</div>');

  $('#notebook').append(el);

};

var updateTOC = function() {
  var toc = $('#toc');
  toc.empty();

  //just go through all html header elements, its easier than iterating 
  //IPython.notebook.get_cells()
  
  //Build hierarchical TOC with nested <ul>
  // var prevLevel = 0;
  // var parent = toc;
  // $('#notebook').find(':header').each(function(idx,el) {
  //   var level = parseInt(el.nodeName.substring(1), 10);

  //   if (level > prevLevel ) {
  //     while (level > prevLevel) {
  //       prevLevel += 1;
  //       var child = $('<ul class="nav nav-list"></ul>')
  //       parent.append(child);
  //       parent = child;
  //     }
    
  //   } else if (prevLevel == level) {
  //     //parent is the same;
    
  //   } else if (level < prevLevel) {
      
  //     while (level < prevLevel) {
  //       prevLevel -= 1;
  //       parent = parent.parent();
  //     }
  //   }

  //   var anchor = '#' + el.id;
  //   var text = el.innerText;
  //   var li = $('<li>').append($('<a>')
  //               .text(text)
  //               .attr('href',anchor)
  //               ); 
  //   parent.append(li);
  //   prevLevel = level;

  // })

  var parent = $('<ul class="nav nav-list"></ul>');
  toc.append(parent);
  var nlevel = {};
  $('#notebook').find(':header').each(function(idx,el) {
    var level = parseInt(el.nodeName.substring(1), 10);
    
    nlevel[level] = (nlevel[level] || 0 ) + 1
    
    var anchor = '#' + el.id;
    var text = el.textContent.replace('¶','');
    var li = $('<li>')
            .addClass('toc-h' + level)

    if (level == 1) {
      text = nlevel[level] + '. ' + text;
    } else if (level == 2) {
      text = nlevel[level-1] + '.' + nlevel[level] + '. ' + text;
    }

    li.append($('<a>')
              .text(text)
              .attr('href',anchor)
              ); 
    parent.append(li);
    prevLevel = level;

  })

}

var addCSS = function() {
  $('head').append('<link rel="stylesheet" href=' + 
                    require.toUrl('custom/toc/toc.css') + 
                    ' />');
};

createTOC();
updateTOC();
addCSS();


