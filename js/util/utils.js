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
 * Pushes new information the provided ChartJS chart
 * In this case the label will be a timestamp/date and the data will be the viewer count
 * 
 * @param {any} chart The chart object
 * @param {any} label The label for the data
 * @param {any} data The data to be inserted into the dataset
 */
function pushToChart(chart, label, data) {
    if (chart.data.labels.length > 15) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);

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
    if(index == -1) {
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