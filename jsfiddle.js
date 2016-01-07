<body>
	<div class="container">

		<!-- Session View - Overview Bar -->
		<div class="row">
			<div class="col-sm-12">
				<div id="d3SessionOverview">
					<!-- D3 Session View, Overview: timeline GOES HERE -->
				</div>
			</div>
		</div> <!-- row -->

	</div> <!-- container -->

	<script type="text/javascript">
var data;

// Main: These functions execute once data has been saved to a global variable
// so that the passed JSON document will only be retrieved once.
d3.json("BAER_100.json", function(json) {
	data = json;

	d3SessionView();	// D3 Session View: Overview timeline
});

// Session View IN PROGRESS. check scale, x, and width values
function d3SessionView() {
	//d3.select(window).on("resize.5", resize);	// the ".5" here is a workaround for multiple responsive
												// d3 objects on one page. 

	var w = parseFloat(d3.select("#d3SessionOverview").style("width"));
	var h = 204;

	var talkTurns = data.session.talkTurn;
	var selected = talkTurns;

	var bar1Margin = {top: 24, right: 0, bottom: 24, left: 0};
	var bar2Margin = {top: 24, right: 0, bottom: 24, left: 0};
	var bar1Height = (h - bar1Margin.top - bar1Margin.bottom - bar2Margin.top - bar2Margin.bottom) / 2;
	var bar2Height = (h - bar1Margin.top - bar1Margin.bottom - bar2Margin.top - bar2Margin.bottom) / 2;

	var x = d3.scale.linear()
		.domain([0, d3.max(talkTurns, function(d) { 
			return d.endTime;
		})])
		.range([0, w]);
	var x2 = d3.scale.linear()
		.domain([0, d3.max(talkTurns, function(d) { 
			return d.endTime;
		})])
		.range([0, w]);

	var xAxis = d3.svg.axis().scale(x).orient("top");
	var x2Axis = d3.svg.axis().scale(x2).orient("top");

	var brush = d3.svg.brush()
		.x(x)
		.extent([0, d3.max(talkTurns, function(d) {
			return d.endTime / 10;
		})])
		.on("brush", brushed);

	var svg = d3.select("#d3SessionOverview").append("svg")
		.attr("width", w)
		.attr("height", h);

	var context = svg.append("g")
		.attr("class", "context")
		.attr("transform", "translate(" + bar1Margin.left + "," + bar1Margin.top + ")");

	var focus = svg.append("g")
		.attr("class", "focus")
		.attr("transform", "translate(" + bar2Margin.left + "," + (bar1Margin.top + bar1Height + bar1Margin.bottom + bar2Margin.top) + ")");

	x.domain([0, d3.max(talkTurns, function(d) {
		return d.endTime;
	})]);
	x2.domain(x.domain());

	focus.selectAll("rect").data(brush.extent())
		.enter()
		.append("rect")
		.attr("x", function(d) {
			return x2(d.startTime);
		})
		.attr("width", function(d) {
			return x2(d.duration);
		})
		.attr("height", bar1Height)
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

	focus.append("g")
		.attr("class", "x axis")
		.call(xAxis);

	context.selectAll("rect").data(talkTurns)
		.enter()
		.append("rect")
		.attr("x", function(d) {
			return x(d.startTime);
		})
		.attr("width", function(d) {
			return x(d.duration);
		})
		.attr("height", bar1Height)
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

	context.append("g")
		.attr("class", "x axis")
		.call(x2Axis);

	context.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		.attr("height", bar1Height / 2);

	function brushed() {
		if (brush.empty()) {
			x2.domain(x.domain());
		} else {
			x2.domain(brush.extent());
		}

		focus.selectAll("rect").data(brush.extent())
			.enter()
			.append("rect")
			.attr("x", function(d) {
				return x2(d.startTime);
			})
			.attr("width", function(d) {
				return x2(d.duration);
			})
			.attr("height", bar1Height)
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

		focus.select(".x.axis").call(x2Axis);
	}
}

    </script>
</body>
















