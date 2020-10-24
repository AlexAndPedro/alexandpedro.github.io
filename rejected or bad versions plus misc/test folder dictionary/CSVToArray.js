/**
 * CSVToArray
 *
 * Converts a comma-separated values (CSV) string to a 2D array.
 *
 * Use `Array.prototype.slice()` and `Array.prototype.indexOf('\n')` to remove
 * the first row (title row) if `omitFirstRow` is `true`. Use
 * `String.prototype.split('\n')` to create a string for each row, then
 * String.prototype.split(delimiter) to separate the values in each row. Omit
 * the second argument, `delimiter`, to use a default delimiter of `,`. Omit the
 * third argument, `omitFirstRow`, to include the first row (title row) of the
 * CSV string.
 *
 * @param {String} data The CSV string of data.
 * @param {String} delimiter The field delimiting character.
 * @param {Boolean} omitFirstRow Whether or not to omit the header/first row.
 * @return {Array} The comma-separated values (CSV) string as a 2D Array.
 */
const CSVToArray = (data, delimiter = ",", omitFirstRow = false) =>
    data
        .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
        .split("\n")
        .map(v => v.split(delimiter));
 
//
// Compiled (ES2015)
var CSVToArray = function CSVToArray(data) {
    var delimiter =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";
    var omitFirstRow =
        arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : false;
 
    return data
        .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
        .split("\n")
        .map(function(v) {
            return v.split(delimiter);
        });
};
 
// --------------------------------------------------
// Example Usage
// --------------------------------------------------
 
CSVToArray("a,b\nc,d"); // [['a','b'],['c','d']];
CSVToArray("a;b\nc;d", ";"); // [['a','b'],['c','d']];
CSVToArray("col1,col2\na,b\nc,d", ",", true); // [['a','b'],['c','d']];