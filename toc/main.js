var ADDNUMBER = false;
var MAXLEVEL = 3;

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

  console.log("updating TOC")

  var parent = $('<ul class="nav nav-list"></ul>');
  toc.append(parent);
  var nlevel = {};

  $('#notebook').find(':header').each(function(idx,el) {
    
    if ($(el).parents('.output_area').length > 0) {
      //this means this header element was output from a codecell. IGNORE
      return;
    }

    var level = parseInt(el.nodeName.substring(1), 10);
    if (level > MAXLEVEL) return;
    
    nlevel[level] = (nlevel[level] || 0 ) + 1
    
    var anchor = '#' + el.id;
    var c = $(el).clone(); //this should copy the whole html, including mathjax
        c.find('a').remove();  //may include <a class=".anchor-text">
        c.find('script[type="math/tex"]').remove(); //may include <script type=["math/text"]
    
    var text = c.contents().first().text();

    if (ADDNUMBER) {
      if (level == 1) {
        text = nlevel[level] + '. ' + text;
      } else if (level == 2) {
        text = nlevel[level-1] + '.' + nlevel[level] + '. ' + text;
      }
    }

    var li = $('<li>')
        .addClass('toc-h' + level)
        .append($('<a>')
              .attr('href',anchor)
              .text(text)
              .append(c.children())
              ); 
    parent.append(li);
    prevLevel = level;

  })


}

var updateTOCAfterMath = function() {
  MathJax.Hub.queue.Push(updateTOC); //this should execute after all mathjax has been typset
}

var addCSS = function() {
  $('head').append('<link rel="stylesheet" href=' + 
                    require.toUrl('custom/toc/toc.css') + 
                    ' />');
};

                
var patchRender = function() {

  $([IPython.MarkdownCell,IPython.HeadingCell]).each(function(idx,cell) {
    
    var old_render = cell.prototype.render;

    cell.prototype.render = function() {
      var r = old_render.call(this);
      updateTOCAfterMath();
      return r;
    };
  });

  console.log("render patched");
}


createTOC();
updateTOC(); //first pass
patchRender();
updateTOCAfterMath();
addCSS();