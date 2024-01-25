/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 81.11111111111111, "KoPercent": 18.88888888888889};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6166666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7, 500, 1500, "GET - /public/crocodiles/1/-1"], "isController": false}, {"data": [1.0, 500, 1500, "GET - /public/crocodiles/1/-0"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "GET - /public/crocodiles/"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "GET - test-api.k6.io"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "GET - /public/crocodiles/1/"], "isController": false}, {"data": [1.0, 500, 1500, "GET - test-api.k6.io-0"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "GET - /public/crocodiles/-1"], "isController": false}, {"data": [0.25, 500, 1500, "GET - test-api.k6.io-1"], "isController": false}, {"data": [1.0, 500, 1500, "GET - /public/crocodiles/-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 17, 18.88888888888889, 901.244444444445, 157, 2468, 469.0, 1934.9000000000008, 2068.65, 2468.0, 11.529592621060722, 22.662855495772483, 1.9876537279016142], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET - /public/crocodiles/1/-1", 15, 0, 0.0, 686.9333333333333, 160, 1694, 213.0, 1636.4, 1694.0, 1694.0, 2.045547524887495, 0.5433485612982408, 0.27367188565389333], "isController": false}, {"data": ["GET - /public/crocodiles/1/-0", 15, 0, 0.0, 226.46666666666667, 157, 469, 160.0, 393.40000000000003, 469.0, 469.0, 1.9638648860958365, 0.6923390858208955, 0.2627436419874313], "isController": false}, {"data": ["GET - /public/crocodiles/", 9, 7, 77.77777777777777, 1816.777777777778, 1335, 2468, 1723.0, 2468.0, 2468.0, 2468.0, 3.646677471636953, 4.170175116491086, 0.9615262864667747], "isController": false}, {"data": ["GET - test-api.k6.io", 6, 5, 83.33333333333333, 1751.8333333333333, 1327, 2130, 1765.5, 2130.0, 2130.0, 2130.0, 2.797202797202797, 32.11593094405595, 0.6392045454545454], "isController": false}, {"data": ["GET - /public/crocodiles/1/", 15, 5, 33.333333333333336, 914.9333333333333, 322, 2167, 370.0, 2035.6000000000001, 2167.0, 2167.0, 1.921598770176787, 1.1878633022674865, 0.5141777959262106], "isController": false}, {"data": ["GET - test-api.k6.io-0", 6, 0, 0.0, 340.0, 291, 469, 299.0, 469.0, 469.0, 469.0, 5.819592628516004, 1.9379698108632397, 0.6649339233753638], "isController": false}, {"data": ["GET - /public/crocodiles/-1", 9, 0, 0.0, 1472.5555555555557, 1040, 1991, 1428.0, 1991.0, 1991.0, 1991.0, 4.511278195488722, 3.5773026315789473, 0.5947485902255639], "isController": false}, {"data": ["GET - test-api.k6.io-1", 6, 0, 0.0, 1409.8333333333335, 1032, 1657, 1470.5, 1657.0, 1657.0, 1657.0, 3.5885167464114835, 40.006354665071775, 0.4100160735645933], "isController": false}, {"data": ["GET - /public/crocodiles/-0", 9, 0, 0.0, 341.44444444444446, 291, 469, 300.0, 469.0, 469.0, 469.0, 8.482563619227143, 2.9738675188501413, 1.1183067271442035], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,549 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,730 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 2,034 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 2,468 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,817 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,948 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,974 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,786 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,723 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 2,111 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,716 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,580 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,582 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 2,130 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 2,167 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,801 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,980 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 5.882352941176471, 1.1111111111111112], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 17, "The operation lasted too long: It took 1,549 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,730 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 2,034 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 2,468 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,817 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET - /public/crocodiles/", 9, 7, "The operation lasted too long: It took 1,723 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 2,111 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,716 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,582 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 2,034 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, {"data": ["GET - test-api.k6.io", 6, 5, "The operation lasted too long: It took 1,974 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,549 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,730 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 2,130 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,801 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, {"data": ["GET - /public/crocodiles/1/", 15, 5, "The operation lasted too long: It took 1,948 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,786 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,580 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 2,167 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,817 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
