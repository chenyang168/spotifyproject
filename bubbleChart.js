//reference: https://www.freecodecamp.org/news/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46/
// https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372


function dealWithData(data) {
	console.log(data);
	sumDiction = {};
	sumlst = [];
	for(var i=0; i<data.length; i++) {
		// console.log(data)
		console.log('iterate genre',data[i].genre);
		if (!(data[i].genre in sumDiction)) {
			sumDiction[data[i].genre] = 0;
		}
		sumDiction[data[i].genre]+=1;
	}

	for(var [key,value] of Object.entries(sumDiction)) {
		if(key!=='undefined') {
			sumlst.push({name:key, num:value});
		}
	}
	console.log('bubbleChart data', sumlst);
	return sumlst;
}

function getMinMax(data) {
	var max=0, min=0;
	for(item of data) {
		if(item.num>max) {
			max=item.num
		}
		if(item.num<min) {
			min=item.num
		}
	}
	return [min,max];
}

var bubbleChart = function(width, height, selection) {
	var width=width, height=height;
	return d3.select(selection)
				.append("svg")
				.attr('width',width)
				.attr('height', height);
};

define(function(){
	var displayGenreChart= function(data) {
		var width = window.innerWidth, height = 1000;
		var data = dealWithData(data);
		var chart = bubbleChart(width,height,'#genreAllChart');
		var dataLength = data.length;
		var domain = getMinMax(data);
		var customScale = d3.scaleLinear().domain(domain).range([2,200]);
		var customScaleForColor = d3.scaleLinear().domain([0,dataLength-1]).range([0,1]);
		// var customColor = d3.scaleSequential(function()).domain().range([0,1]);
		var eachBlock = chart.selectAll('g circleText')
								.data(data).enter().append('g');
									// .attr('r', function(d) {return customScale(d.num)});
		var bubble = eachBlock.append('circle')
								.attr('r', function(d) {return customScale(d.num)})
								.attr('fill', function(d,i) {return d3.interpolateRainbow(customScaleForColor(i))});
								// .attr('fill', 'none')
								// .attr('stroke','blue');
		var text = eachBlock.append('text').text(function(d) {return d.name})
								.attr('dx', '-5')
								.attr('fill','white')
			
		function ticked() {	
		  var u = d3.select('svg')
		    .selectAll('g')
		    .data(data)

		  u.enter()
		    .append('circle')
		    .merge(u)
		    .attr('transform', function(d) {
		    	console.log(d.x,d.y);
		    	return 'translate('+d.x+','+d.y+')'
		    })
		    

		  u.exit().remove();
		};
		
		var simulation = function(width, height,data) {
			var simulation =  d3.forceSimulation(data)
						// .force("forceX", d3.forceX().strength(.1).x(width * .5))
						// .force("forceY", d3.forceY().strength(.1).x(height * .5))
						.force("center", d3.forceCenter().x(width * .5).y(height * .5))
						.force("charge", d3.forceManyBody().strength(-15))
						.force('collision', d3.forceCollide().radius(function(d) {
						    return customScale(d.num)
						  }))
						.on('tick', ticked);
			return simulation;
		};

			simulation(width, height, data);
			
		
	};
	return {
		displayGenreChart:displayGenreChart
	};
})

