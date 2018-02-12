/**
 * Sets an item in session storage
 * 
 * @param {any} name The index of the item
 * @param {any} value 
 */
function setItem(name, value) {
    sessionStorage[name] = value;
}

/**
 * Gets the value for an item stored in storage
 * 
 * @param {any} name The name of the item
 * @returns The value of the item
 */
function getItem(name) {
    return sessionStorage[name];
}

/**
 * Logs the user out.
 * Clears every session storage value.
 */
function logout() {
    sessionStorage.clear(); //Clear
    location.reload(); //Reload the page to restart process
}

/**
 * Load previous information
 */
function loadPreviousValues() {
    //Set previous values
    $("#peak-viewer-count").text(getItem("peak-viewers"));
    $("#net-follower-gain").text(getItem("new-followers"));
    $("#unique-viewer-number").text(getItem("new-viewers"));
    console.log("Called");
    $("#unique-chatters").text(JSON.parse(getItem("unique-chatters")).length);

    //Update chart
    var chartData = JSON.parse(getItem("chart-data"));
    for(var label in chartData) {
        var data = chartData[label];
        
        //Don't push to chart if data is already there
        if(liveViewerChart.data.labels.indexOf(label) != -1) {
            continue;
        }

        liveViewerChart.data.labels.push(label);
        liveViewerChart.data.datasets[0].data.push(data);
    
        if (data <= (liveViewerChart.options.scales.yAxes[0].ticks.min + 10)) {
            if (data - 30 <= 0) {
                liveViewerChart.options.scales.yAxes[0].ticks.min = 0;
            } else {
                liveViewerChart.options.scales.yAxes[0].ticks.min = parseInt((data - 30) / 10, 10) * 10;
            }
        }
    
        if (data >= (liveViewerChart.options.scales.yAxes[0].ticks.max - 10)) {
            liveViewerChart.options.scales.yAxes[0].ticks.max = parseInt((data + 30) / 10, 10) * 10;
        }
    
        liveViewerChart.update();
    }
}

/**
 * Creates a new instance of the chart
 * 
 * @param {any} id The ID of the canvas
 * @returns A new ChartJS instance
 */
function createChart(id) {
    return new Chart($(id), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: "Viewers",
                borderColor: "#0B62A4",
                backgroundColor: "#2677B5",
                fill: true
            }]
        },
        options: {
            title: {
                display: false
            },
            legend: {
                display: false
            }
        }
    });
}

/**
 * Pushes new information the provided ChartJS chart
 * In this case the label will be a timestamp/date and the data will be the viewer count
 * 
 * @param {any} chart The chart object
 * @param {any} label The label for the data
 * @param {any} data The data to be inserted into the dataset
 */
function pushToChart(chart, label, data) {
    var savedData = JSON.parse(getItem("chart-data"));

    if (chart.data.labels.length > 15) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        savedData.shift();
    }

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    savedData[label] = data;
    setItem("chart-data", JSON.stringify(savedData));

    if (data <= (chart.options.scales.yAxes[0].ticks.min + 10)) {
        if (data - 30 <= 0) {
            chart.options.scales.yAxes[0].ticks.min = 0;
        } else {
            chart.options.scales.yAxes[0].ticks.min = parseInt((data - 30) / 10, 10) * 10;
        }
    }

    if (data >= (chart.options.scales.yAxes[0].ticks.max - 10)) {
        chart.options.scales.yAxes[0].ticks.max = parseInt((data + 30) / 10, 10) * 10;
    }

    chart.update();
}

/**
 * Creates a new row in a table and then inserts the HTML markup
 * If there is over 10 elements in the table already, it will remove the last one
 * 
 * @param {any} tableId The ID of the table
 * @param {any} markup The HTML markup
 */
function addToTable(tableId, markup) {
    var table = document.getElementById(tableId);

    if (table.rows.length >= 10) {
        removeFromTable(tableId, -1); //Remove the last element
    }

    var newRow = table.insertRow(table.rows.length);
    var newCell = newRow.insertCell(0);
    newCell.innerHTML = markup;
}

/**
 * Removes a specified row from the table.
 * If index = -1 it removes the last row of the table
 * 
 * @param {any} tableId The ID of the table
 * @param {any} index The index of the table to remove
 */
function removeFromTable(tableId, index) {
    if (index == -1) {
        document.getElementById(tableId).deleteRow(document.getElementById(tableId).rows.length - 1);
    } else {
        document.getElementById(tableId).deleteRow(index);
    }
}

/**
 * Generates a random number between the given minimum and maxium values
 * 
 * @param {any} min The minimum value
 * @param {any} max The maximum value
 * @returns A whole number between the given range
 */
function generateRandNumb(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 
 * @returns 12-hour based time from the local timezone
 */
function getLocalTime() {
    return new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}