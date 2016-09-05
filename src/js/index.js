var colisionDetected = false;
var dragging = false;

$(document).ready(
  function()
  {
    $("#shape").draggable({
    drag: function( event, ui )
    {
      dragging = true;
      $(".pos").css("left", event.pageX);
      $(".pos").css("top", event.pageY);
    }});

    $("#bc").mouseup(
      function(event) {
      if(dragging)
      {
        var pos = $("#goal").position();
        var w = $("#goal").width(), h = $("#goal").height();
        var threshold = 50;
        // console.log("posX: " + pos.left + "\tposY: " + pos.top + "\tw: " + w + "\th:" + h);
        // console.log("eX: " + event.pageX + "\teY: " + event.pageY);
        if(event.pageX >= pos.left - threshold && event.pageX <=  pos.left + w + threshold)
        {
          // console.log("w ok");
          if(event.pageY >= pos.top - threshold && event.pageY <=  pos.top + h + threshold)
          {
            // console.log("h ok colliding");
            colisionDetected = true;
          }
        }

        if(!colisionDetected)
        {
          console.log("no collision");
          $(".pos").animate(
            {
              left: "50%",
              top: "50%"
            }, 400, function() {});
        }
        else
        {
          console.log("colided");
          $("#shape").hide()
          $(".pos").animate(
            {
              backgroundColor: "#ffffff",
              width: "500%",
              height: "500%",
              left: "0%",
              top: "0%"
            }, 1500, function()
            {
              $("#bc").css("background-color", "rgb(255, 255, 255)")
              $(".pos").hide()
              $("#goal").hide()

              window.location.replace(`../html/intro.html`);
            }
          );

        }
      }
      dragging = false;
    });
  });
