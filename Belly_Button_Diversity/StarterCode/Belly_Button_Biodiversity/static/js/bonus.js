
function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/"+ sample).then(function(data){
  
    // Use d3 to select the panel with id of `#sample-metadata`
    let selector = d3.select("#sample-metadata").html("");
      // Use `.html("") to clear any existing metadata
    selector.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
   
      for (i=0; i < 5; i++){
      selector.append("text").html("<font size='1'>"
      + Object.entries(data)[i][0] + ": "
      + Object.entries(data)[i][1] + "</font><br>");
    };
      selector.append("text").html("<font size = '1'>SAMPLEID: " + Object.entries(data)[6][1] + "</font><br>");
    });
  }
  
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json("/samples/" + sample).then(function(data){
      // ID values from JSON Data
      let otu_ids = data.otu_ids;
      let otu_labels = data.otu_labels;
      let sample_values =  data.sample_values;
    
      // @TODO: Build a Bubble Chart using the sample data
      let trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        },
        text: otu_labels
      };
  
  
    var data1 = [trace1];
  
    let layout = {
      showlegend: false
    };
  
    Plotly.newPlot('bubble', data1, layout);
      
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
      var sample_data = otu_ids.map( (x, i) => {
        return {"otu_ids": x, "otu_labels": otu_labels[i], "sample_values": sample_values[i]}        
      });
  
      sample_data = sample_data.sort(function(a, b) {
        return b.sample_values - a.sample_values;
      });
  
      sample_data = sample_data.slice(0, 10);
  
      var trace2 = {
        labels: sample_data.map(row => row.otu_ids),
        values: sample_data.map(row => row.sample_values),
        hovertext: sample_data.map(row => row.otu_labels),
        type: 'pie'
      };
  
      var data2 = [trace2];
  
      Plotly.newPlot("pie", data2);
      // BONUS: Build the Gauge Chart
      buildGauge(data.WFREQ);
      var gauge_data = [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: 420,
          title: { text: "Speed", font: { size: 24 } },
          delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
          gauge: {
            axis: { range: [null, 500], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 250], color: "cyan" },
              { range: [250, 400], color: "royalblue" }
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 490
            }
          }
        }
      ];
      
      var layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" }
      };
      
      Plotly.newPlot("gauge", data, layout);
    
      

    });
  }
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  