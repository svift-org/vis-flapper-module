SVIFT.vis.flapper = (function (data, container) {
 
  // Module object
  var module = SVIFT.vis.base(data, container);
 
   module.d3config = {
    // ease:d3.easeCubicInOut, 
    // interpolate: d3.interpolate(0,data.data.data[0].data[0]),
    numberCycle : { 0: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", 6: "7", 7: "8", 8: "9", 9: " "},
    dataZeros: function(){
      var dataZeros = "";
      for (var i = 0; i < data.data.data[0].data[0].toString().length; i++) {
        dataZeros+="0";
      };
      return dataZeros
    }(),
  };

  //Initialisation e.g. creat svg object
  module.setup = function () {

    module.d3config.visContainer =  d3.select(".viz-container");

    module.d3config.visContainer.selectAll("g")
      .data(module.d3config.dataZeros)
      .enter()
      .append("g")
        .attr("class", "flap")
        // .style("left", (d, i) => i * 118 + "px");

  };

  //Data Processing, after module.data is set, module.process() should process the data
  module.process = function () {
  };

  //Update should do the drawing, similar to Bostock's general update pattern
  module.update = function () {
  };

  //After window resize events this is being called, in most cases, this should call the update event after setting width and height
  module.resize = function () {

    var visWidth = module.container.node().offsetWidth - module.config.margin.left - module.config.margin.right;
    var visHeight = module.container.node().offsetHeight - module.config.margin.top - module.config.margin.bottom -(module.config.bottomTextHeight + module.config.topTextHeight);
    var maxVisSize = Math.min(visWidth,visHeight);

    var flapSize = maxVisSize / module.d3config.dataZeros.length;

    module.d3config.flaps = module.d3config.visContainer.selectAll(".flap")
      .attr("transform", function(d,i){
        return "translate(" + (i * flapSize) +",0)";
      });


      var flapSizeWidth =  flapSize -10;
      var flapSizeHeight =  flapSize -10;


      d3.select("svg defs")
          .append("clipPath")
            .attr("id","cut-off-bottom")
            .append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width",flapSizeWidth)
            .attr("height",flapSizeHeight/2);

      d3.select("svg defs")
          .append("clipPath")
            .attr("id","cut-off-top")
            .append("rect")
            .attr("x",0)
            .attr("y",flapSizeHeight/2)
            .attr("width",flapSizeWidth)
            .attr("height",flapSizeHeight/2);


    ["next", "prev", "back", "front"].forEach(function(d){

      if (d === "front") {
        module.d3config.flaps.append("rect")
          // .attr("width","100")
          // .attr("height","100")
          .attr("class", "divider");
      }


      module.d3config.flaps.append("rect")
        .attr("class", "half " + d)
        .attr("width",flapSizeWidth)
        .attr("height",flapSizeHeight)
        .attr("fill","#444")
        .attr("clip-path",(d=="back"||d=="prev") ? "url(#cut-off-top)" : "url(#cut-off-bottom)")
      
      module.d3config.flaps.append("text")
            .text(function(d){return d})
            .attr("x", flapSizeWidth/2)
            .attr("y", flapSizeHeight/2 * 0.95)
            .attr("text-anchor", "middle")
            .attr("font-size", flapSizeWidth + "px")
            .attr("font-family", "Roboto Mono")
            .attr("dominant-baseline", "central")
            .attr("fill","#ecdb41")
            .attr("clip-path",(d=="back"||d=="prev") ? "url(#cut-off-top)" : "url(#cut-off-bottom)")


    });


    if(module.playHead == module.playTime){
        module.goTo(1);
        module.pause();
    }

  };

  module.animateFlaps = function(t){

    //NOT DONE

    d3.selectAll(".flap")
      .each(function(startNumber, i) {
        var endNumber = data.toString()[i];
        var flap = d3.select(this);
        flipper(flap, endNumber);
      });

    function flipper(flap ,endNumber) {

      var next = 0;
      var prevFlaps = flap.selectAll(".prev span, .front span");
      var fast;

      flap.select(".front").on("animationiteration", function() {

        //if end of animation
        if (next === endNumber) {
          flap.classed("animated fast", false)
            .selectAll("span")
              .text(endNumber);
        }

        if (!fast) {
          fast = flap.classed("fast", true);
        }

        prevFlaps.text(next);
        next = numberCycle[next];

      });

      flap.classed("animated", true);

    }

    //NOT DONE

  };

  module.timeline = {
    flaps: {start:0, end:2000, func:module.animateFlaps}
  };

  return module;
 });