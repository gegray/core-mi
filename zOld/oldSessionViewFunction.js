			function d3SessionView() {
				//d3.select(window).on("resize.5", resize);	// the ".5" here is a workaround for multiple responsive
															// d3 objects on one page. 

				var w = parseFloat(d3.select("#d3SessionOverview").style("width"));
				var h = 54;

				var talkTurns = data.session.talkTurn;

				var xScale1 = d3.scale.linear()
					.domain([0, d3.max(talkTurns, function(d) { 
						return d["endTime"];
					})])
					.range([0, w]);

				var svg1 = d3.select("#d3SessionOverview")
					.append("svg")
					.attr("width", w)
					.attr("height", h);

				var overviewRects = svg1.selectAll("rect")
					.data(talkTurns)
					.enter()
					.append("rect")

				overviewRects.attr("x", function(d) {
						return xScale1(d.startTime);
					})
					.attr("width", function(d) {
						return xScale1(d.duration);
					})
					.attr("height", h)
					.attr("class", function(d) {
						if (d.speaker == "therapist") {
							return "greenFill";
						} else {
							return "blueFill";
						}
					})
					.attr("fill-opacity", function(d) {
						return d.vocalArousal;
					});

				var brush = d3.svg.brush()
					.x(xScale1);

				var slider = svg1.append("g");

				brush.extent([0, w / 10]);
				brush(slider);

				slider.selectAll("rect")
					.attr("height", h);

				/*
				var detail = d3.select("#d3SessionDetailView")
					.append("svg")
					.attr("width", w)
					.attr("height", h)
				*/
				
				/*
				// Responsive width for D3 Percent Complex Reflections: bar graph
				function resize() {
					// adjust width when the window size changes
					w = parseFloat(d3.select("#d3PctComplexReflectionsBar").style("width"));

					svg.attr("width", w);
					totalBar.attr("width", w);
					therapistBar.attr("width", w * therapistPct);
				}
				*/
			}