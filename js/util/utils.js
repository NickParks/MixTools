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
 * Creates a new row in a table and then inserts the HTML markup
 * 
 * @param {any} tableId The ID of the table
 * @param {any} markup The HTML markup
 */
function addToTable(tableId, markup) {
    var table = document.getElementById(tableId);
    var newRow = table.insertRow(table.rows + 1);
    var newCell = newRow.insertCell(0);
    newCell.innerHTML = markup;
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