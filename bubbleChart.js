//reference: https://www.freecodecamp.org/news/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46/
// https://bl.ocks.org/HarryStevens/f636199a46fc4b210fbca3b1dc4ef372


function dealWithData(data) {
	console.log(data);
	sumDiction = {};
	sumlst = [];
	for(var item of data) {
		console.log('iterate genre',item, item['genre'], item.genre);
		if (!(item.genre in sumDiction)) {
			sumDiction[item.genre] = 0;
		}
		sumDiction[item.genre]+=1;
	}

	for(var [key,value] of Object.entries(sumDiction)) {
		sumlst.push({name:key, num:value});
	}
	console.log('bubbleChart data', sumlst);
	return sumlst;
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
		var width = window.innerWidth, height = window.innerHeight;
		
			var chart = bubbleChart(width,height,'#genreChart');
			var data = dealWithData(data);
			console.log('printdata',data);
			var bubbles = chart.append('g')
								.selectAll('circle')
								.data(data).enter().append('circle')
									.attr('r', function(d) {return 3*d.num});
			
			function ticked() {	
			  var u = d3.select('g')
			    .selectAll('circle')
			    .data(data)

			  u.enter()
			    .append('circle')
			    .attr('r', function(d) {
			      return 10*d.num
			    })
			    .merge(u)
			    .attr('cx', function(d) {
			      return d.x
			    })
			    .attr('cy', function(d) {
			      return d.y
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
						    return 3*d.num
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

