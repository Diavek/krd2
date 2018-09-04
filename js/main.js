
/*const month = ["Jan16","Feb16","Mar16","Apr16","May16","Jun16","July16","Aug16","Sept16","Oct16","Nov16","Dec16","Jan17","Feb17","Mar17","Apr17","May17","Jun17","July17","Aug17","Sept17","Oct17","Nov17","Dec17","Jan18","Feb18","Mar18","Apr18","May18","Jun18"];*/
const month = ["Jan-16","Feb-16","Mar-16","Apr-16","May-16","Jun-16","July-16","Aug-16","Sept-16","Oct-16","Nov-16","Dec-16","Jan-17","Feb-17","Mar-17","Apr-17","May-17","Jun-17","July-17","Aug-17","Sept-17","Oct-17","Nov-17","Dec-17","Jan-18","Feb-18","Mar-18","Apr-18","May-18","Jun-18"];


var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

	

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");
			
//gauges			
var g0=d3.select("#speedometer")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
		

			
/*speedometer
var vg=d3.select("#speedometer")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
		

  var vg =vg.append("g").attr("transform","translate(600,350)");
  var domain = [0,100];
  
  var gg = viz.gg()
	.domain(domain)
	.outerRadius(60)
	.innerRadius(6)
	.value(0.5*(domain[1]+domain[0]))
	.duration(1000);
  
  gg.defs(vg);
  g.call(gg);  
  
  d3.select(self.frameElement).style("height", "400px");
 setInterval( function(){gg.setNeedle(domain[0]+Math.random()*(domain[1]-domain[0]));},2000);
			
speedometer end*/
		
/*	
var l = d3.select("#speedometer")
				.append("svg")
				.attr("width",100)
				.attr("height", 100);
				
var gauge = iopctrl.arcslider()
                .radius(30)
                .events(false)
                .indicator(iopctrl.defaultGaugeIndicator);
        gauge.axis().orient("in")
                .normalize(true)
                .ticks(12)
                .tickSubdivide(3)
                .tickSize(10, 8, 10)
                .tickPadding(5)
                .scale(d3.scale.linear()
                        .domain([0, 160])
                        .range([-3*Math.PI/4, 3*Math.PI/4]));

        var segDisplay = iopctrl.segdisplay()
                .width(20)
                .digitCount(6)
                .negative(false)
                .decimals(0);

        svg.append("g")
                .attr("class", "segdisplay")
                .attr("transform", "translate(30, 50)")
                .call(segDisplay);

        svg.append("g")
                .attr("class", "gauge")
                .call(gauge);

        segDisplay.value(56749);
        gauge.value(120);
*/
		
var time = 0;
var interval;
var formattedData;

// Tooltip
var tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
        var text = "<strong>Brand:</strong> <span style='color:white;text-transform:capitalize'>" + d.brand + "</span><br>";
        text += "<strong>buying %:</strong> <span style='color:white'>" + d3.format("d")(d.buying) + "</span><br>";
        text += "<strong>engagement %:</strong> <span style='color:white'>" + d3.format("d")(d.engagement) + "</span><br>";
        text += "<strong>Visits:</strong> <span style='color:white'>" + d3.format(",.0f")(d.visits) + "</span><br>";
        return text;
    });
g.call(tip);

// Scales
var x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 40]);
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 80]);
var area = d3.scaleLinear()
    .range([25*Math.PI, 3000000*Math.PI])
    .domain([2000, 1400000000]);
var marketColor = d3.scaleOrdinal(["#800000","#e60000","#00000","#C8C8C8","#f4bc00","#FAEC62"]);  

// Labels
var xLabel = g.append("text")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("engagement (%)");
var yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("buying (%)")
var timeLabel = g.append("text")
    .attr("y", height -300)
    .attr("x", width - 50)
    .attr("font-size", "40px")
    //.attr("opacity", "0.4")
    .attr("text-anchor", "middle")
	.attr("stroke","black")
    .text("Jan16");
	
var chartTitle = g.append("text")
	.attr("y", height - 360)
	.attr("x", width - 370)
	.attr("font-size", "30px")
	.attr("text-anchor", "middle")
	.attr("fill", "black")
	.attr("stroke", "black")
	.text("Website Traffic Vs. buying(%) Vs. engagement(%)");
	
var note = g.append("text")
	.attr("y", height +50)
	.attr("x", width -150)
	.attr("font-size", "10px")
	.attr("border", "red")
	.attr("text-anchor", "left")
	.text("*Hover over circles for details")
	
	
	

// X Axis
var xAxisCall = d3.axisBottom(x)
    .tickFormat(function(d){ return +d; });
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")")
    .call(xAxisCall);

// Y Axis
var yAxisCall = d3.axisLeft(y)
    .tickFormat(function(d){ return +d; });
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);
	
var brands = ["Pro KSA", "Pro UAE", "Escalate KSA", "Escalate UAE","Bumblebee KSA","Bumblebee UAE"];

var legend = g.append("g")
    .attr("transform", "translate(" + (width - 10) + 
        "," + (height - 190) + ")");
var trafficlegend = g.append("g")
    .attr("transform", "translate(" + (width) + 
        "," + (height - 180) + ")");
		
trafficlegend.append("text")
	.attr("x", 0)
        .attr("y", 120)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text("(Circle Area = Visits)");
			

brands.forEach(function(brand, i){
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");

    legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", marketColor(brand))
		.style("stroke", "black");

    legendRow.append("text")
        .attr("x", -10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(brand);
});

d3.json("data/data2.json").then(function(data){
    console.log(data);

    // Clean data
    formattedData = data.map(function(year){
        return year["performance"].filter(function(brand){
            var dataExists = (brand.engagement && brand.buying /*&& brand.name && brand.market && brand.bigbrowser && brand.tablet && brand.mobile*/);
            return dataExists
        }).map(function(brand){
            brand.engagement = +brand.engagement;
            brand.buying = +brand.buying;
            return brand;            
        })
    });

    
	/*d3.interval(function(){
			// At the end of our data, loop back
			time = (time < 30) ? time+1 : 0
			update(formattedData[time]);            
		}, 2000);*/
    // First run of the visualization
    update(formattedData[0]);

})

$("#play-button")
    .on("click", function(){
        var button = $(this);
        if (button.text() == "Play"){
            button.text("Pause");
            interval = setInterval(step, 2000);            
        }
        else {
            button.text("Play");
            clearInterval(interval);
        }
    })

$("#reset-button")
    .on("click", function(){
        time = 0;
        update(formattedData[0]);
    })

$("#brand-select")
    .on("change", function(){
        update(formattedData[time]);
    })

$("#date-slider").slider({
    max: 29,
    min: 0,
    step: 1,
    slide: function(event, ui){
        time = ui.value - 0;
        update(formattedData[time]);
    }
})

function step(){
    // At the end of our data, loop back
    time = (time < 29) ? time+1 : 0
    update(formattedData[time]);
}


function update(data) {
    // Standard transition time for the visualization
    var t = d3.transition()
        .duration(2000);
		
	var brandname = $("#brand-select").val();

    var data = data.filter(function(d){
        if (brandname == "all") { return true;}
       /* else {
		return d.brand == brandname;
		}*/
		else if (brandname == "KSA") {
		return d.market == brandname;}
		else if (brandname == "UAE") {
		return d.market == brandname;}
		else if (brandname == "Pro") {
		return d.name == brandname;}
		else if (brandname == "Escalate") {
		return d.name == brandname;}
		else if (brandname == "Bumblebee") {
		return d.name == brandname;}
	})
    console.log(brandname);    
	console.log(data)	;
    function getFields(input, field) {
    var output = [];
    for (var i=0; i < input.length ; ++i)
        output.push(input[i][field]);
    return output;
}


//averages
var mobile = getFields(data, "mobile");
var tablet = getFields(data, "tablet");
var bigbrowser = getFields(data,"bigbrowser");

var sum1 = 0;
for( var i = 0; i < mobile.length; i++ ){
    sum1 += parseInt( mobile[i], 10 ); 
}

var mobileavg = sum1/mobile.length;

var sum2 = 0;
for( var i = 0; i < tablet.length; i++ ){
    sum2 += parseInt( tablet[i], 10 ); 
}

var tabletavg = sum2/tablet.length;

var sum3 = 0;
for( var i = 0; i < bigbrowser.length; i++ ){
    sum3 += parseInt( bigbrowser[i], 10 ); 
}

var bigbrowseravg = sum3/bigbrowser.length;

//gauge 1 START

	var gaugeTitle = g0.append("text")
		.attr("transform","translate(40,40)")
		.attr("font-size", "20px")
		/*.attr("stroke", "black")*/
		.attr("text-anchor","left")
		.text("% Visits By Device");




  var g1 =g0.append("g").attr("transform","translate(100,120)");
  var domain = [0,100];
  
  var gg1 = viz.gg()
	.domain(domain)
	.outerRadius(60)
	.innerRadius(6)
	.value(mobileavg)
	.duration(1000);
  
  gg1.defs(g0);
  g1.call(gg1); 

var gaugeLabel1 = g1.append("text")
	.attr("transform","translate(70,0)")
    .attr("font-size", "20px")

    .attr("text-anchor", "right")
    .text("Mobile %");
	
	 //d3.select(self.frameElement).style("height", "400px");
 //setInterval( function(){gg1.setNeedle(25,0)});
		
	
// gauge 2 START
  var g2 =g0.append("g").attr("transform","translate(100,240)");
  var domain = [0,100];
  
  var gg2 = viz.gg()
	.domain(domain)
	.outerRadius(60)
	.innerRadius(6)
	.value(tabletavg)
	.duration(1000);
  
  gg2.defs(g0);
  g2.call(gg2);  

var gaugeLabel2 = g2.append("text")
	.attr("transform","translate(70,0)")
    .attr("font-size", "20px")

    .attr("text-anchor", "right")
    .text("Tablet %");  
	
// gauge 3 START	
  var g3 =g0.append("g").attr("transform","translate(100,360)");
  var domain = [0,100];	

var gg3 = viz.gg()
	.domain(domain)
	.outerRadius(60)
	.innerRadius(6)
	.value(bigbrowseravg)
	.duration(1000);
  
  gg3.defs(g0);
  g3.call(gg3);  

var gaugeLabel3 = g3.append("text")
	.attr("transform","translate(70,0)")
    .attr("font-size", "20px")

    .attr("text-anchor", "right")
    .text("Big Browser %");




    // JOIN new data with old elements.
    var circles = g.selectAll("circle").data(data, function(d){
        return d.brand;
    });

    // EXIT old elements not present in new data.
    circles.exit()
        .attr("class", "exit")
        .remove();

    // ENTER new elements present in new data.
    circles.enter()
        .append("circle")
        .attr("class", "enter")
		.style("stroke", "black")
        .attr("fill", function(d) { return marketColor(d.brand); })
		.on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(circles)
        .transition(t)
            .attr("cy", function(d){ return y(d.buying); })
            .attr("cx", function(d){ return x(d.engagement) })
            .attr("r", function(d){ return Math.sqrt(area(d.visits) / Math.PI) });

    // Update the time label
    timeLabel.text(month[time])
	
	$("#year")[0].innerHTML = +(time)

    $("#date-slider").slider("value", +(time))

}
