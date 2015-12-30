			// Session View IN PROGRESS. check scale, x, and width values
			function d3SessionView() {
				//d3.select(window).on("resize.5", resize);	// the ".5" here is a workaround for multiple responsive
															// d3 objects on one page. 

				var w = parseFloat(d3.select("#d3SessionOverview").style("width"));
				var h = 204;

				var talkTurns = data.session.talkTurn;
				var selected;

				var bar1Margin = {top: 24, right: 0, bottom: 24, left: 0};
				var bar2Margin = {top: 24, right: 0, bottom: 24, left: 0};
				var bar1Height = (h - bar1Margin.top - bar1Margin.bottom - bar2Margin.top - bar2Margin.bottom) / 2;
				var bar2Height = (h - bar1Margin.top - bar1Margin.bottom - bar2Margin.top - bar2Margin.bottom) / 2;

				var svg = d3.select("#d3SessionOverview").append("svg")
					.attr("width", w)
					.attr("height", h);

				var bar1Group = svg.append("g")
					.attr("class", "bar1Group")
					.attr("transform", "translate(" + bar1Margin.left + "," + bar1Margin.top + ")");

				var bar2Group = svg.append("g")
					.attr("class", "bar2Group")
					.attr("transform", "translate(" + bar2Margin.left + "," + (bar1Margin.top + bar1Height + bar1Margin.bottom + bar2Margin.top) + ")");

				var brushGroup = svg.append("g")
					.attr("class", "brushGroup")
					.attr("transform", "translate(" + bar1Margin.left + "," + bar1Margin.top + ")");

				// Scales
				var axisRange = d3.range(0, d3.max(talkTurns, function(d) {
					return d.endTime;
				}));

				// axisRange.shift(); // gg removes first tick value
				// axisRange.push((axisRange[axisRange.length - 1] + 1)); // gg removes first tick value

				var xScale = d3.scale.linear()
					.domain([0, d3.max(talkTurns, function(d) { 
						return d.endTime;
					})])
					.range([0, w]);

				var xScaleBrush = d3.scale.linear()
					.domain([0, d3.max(talkTurns, function(d) { 
						return d.endTime;
					})])
					.range([0, w]);

				var xScaleAxis = d3.scale.linear()
					.domain(axisRange);

				var xAxis = d3.svg.axis()
					.scale(xScaleAxis)
					.ticks(10)
					.tickSize(4, 0)
					.orient("bottom");

				// Prepare the x axis
				svg.append("g")
					.attr("class", "x axis")
					.attr("width", w)
					.attr("transform", "translate(" + bar2Margin.left + "," + (5 + bar1Margin.top + bar1Height + bar1Margin.bottom + bar2Margin.top + bar2Height) + ")")
					.call(xAxis)
					// more here? looks like axis title only in example:
					// http://codepen.io/chris-creditdesign/pen/tlEgJ

				var brush = d3.svg.brush()
					.x(xScaleBrush)
					.extent([0, d3.max(talkTurns, function(d) {
						return d.endTime / 10;
					})])
					.on("brush", display);

				brushGroup.append("g")
					.attr("class", "brush")
					.call(brush)
					.selectAll("rect")
					.attr("height", bar1Height);

				function display() {
					selected = xScaleBrush.domain()
						.filter(function(d) {
							return (brush.extent()[0] <= d && d <= brush.extent()[1]);
						});

					var start;
					var end;

					// Keep at least 3 bars selected
					if (selected.length > 2 ) {
						start = selected[0];
						end = selected[selected.length];
					} else {
						start = selected[0];
						end = selected[1];
					}

					var updatedData = talkTurns.slice(start, end);
					updateBars(updatedData);
				}

				// update the area
				function update(grp, data, main) {
					grp.selectAll("rect").data(data, function(d, i) {  // , i?
						return d;
					})
					.attr("x", function(d) {
						return xScale(d.startTime);
					})
					.attr("width", function(d) {
						return xScale(d.duration);
					})
					.attr("height", bar2Height)
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
				}

				// initial bar layout
				function enter(grp, data, main) {
					grp.selectAll("rect").data(data, function(d) {
						return d.id;
					})
					.enter()
					.append("rect")
					.attr("x", function(d) {
						return xScale(d.startTime);
					})
					.attr("width", function(d) {
						return xScale(d.duration);
					})
					.attr("height", bar2Height)
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
				}

				function exit(grp, data) {
					grp.selectAll("rect").data(data, function(d) {
						return d;
					})
					.exit()
					.remove();
				}

				function updateBars(data) {
					xScale.domain([d3.min(data, function(d) {
						return d.startTime;
					}), d3.max(data, function(d) { 
						return d.endTime;
					})]);

					update(bar2Group, data, true);	// Update
					enter(bar2Group, data, true);	// Enter
					exit(bar2Group, data);			// Exit
				}

				enter(bar1Group, talkTurns, false);
				updateBars(talkTurns);

				/*
				var slider = svg.append("g");

				brush.extent([0, w / 10]);
				brush(slider);

				slider.selectAll("rect")
					.attr("height", h);
				*/

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