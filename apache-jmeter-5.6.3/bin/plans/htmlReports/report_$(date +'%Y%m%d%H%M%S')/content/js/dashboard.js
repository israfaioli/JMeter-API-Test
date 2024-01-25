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

    var data = {"OkPercent": 51.111111111111114, "KoPercent": 48.888888888888886};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13333333333333333, 500, 1500, "GET - /public/crocodiles/1/-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "GET - /public/crocodiles/1/-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET - /public/crocodiles/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "GET - test-api.k6.io"], "isController": false}, {"data": [0.1, 500, 1500, "GET - /public/crocodiles/1/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "GET - test-api.k6.io-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET - /public/crocodiles/-1"], "isController": false}, {"data": [0.5, 500, 1500, "GET - test-api.k6.io-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "GET - /public/crocodiles/-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 44, 48.888888888888886, 1613.1111111111109, 157, 11322, 1083.0, 3130.000000000001, 5900.350000000004, 11322.0, 4.830399313009876, 9.111089120867325, 0.8327407148990983], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET - /public/crocodiles/1/-1", 15, 12, 80.0, 1713.8666666666666, 221, 5153, 1593.0, 3603.2000000000007, 5153.0, 5153.0, 0.8326856889086266, 0.24264981403352948, 0.11140423767625181], "isController": false}, {"data": ["GET - /public/crocodiles/1/-0", 15, 0, 0.0, 245.20000000000002, 157, 611, 160.0, 515.6, 611.0, 611.0, 0.8803850217161638, 0.31037011019485855, 0.1177858866944477], "isController": false}, {"data": ["GET - /public/crocodiles/", 9, 9, 100.0, 3889.777777777778, 1213, 11322, 2977.0, 11322.0, 11322.0, 11322.0, 0.7577033170567435, 0.5330067930207105, 0.19978505430207105], "isController": false}, {"data": ["GET - test-api.k6.io", 6, 2, 33.333333333333336, 1368.8333333333333, 983, 1704, 1395.5, 1704.0, 1704.0, 1704.0, 3.4227039361095266, 39.29758806332003, 0.7821413291500285], "isController": false}, {"data": ["GET - /public/crocodiles/1/", 15, 13, 86.66666666666667, 1960.6666666666665, 381, 5314, 1968.0, 3819.400000000001, 5314.0, 5314.0, 0.8051097632977297, 0.5184466581235575, 0.2154297608824003], "isController": false}, {"data": ["GET - test-api.k6.io-0", 6, 0, 0.0, 392.0, 285, 610, 323.0, 610.0, 610.0, 610.0, 5.719733079122974, 1.9047158007626313, 0.6535241897044805], "isController": false}, {"data": ["GET - /public/crocodiles/-1", 9, 8, 88.88888888888889, 3495.8888888888887, 927, 11030, 2691.0, 11030.0, 11030.0, 11030.0, 0.7992895204262878, 0.28204096358792186, 0.10537508325932504], "isController": false}, {"data": ["GET - test-api.k6.io-1", 6, 0, 0.0, 972.6666666666667, 688, 1104, 1062.5, 1104.0, 1104.0, 1104.0, 5.286343612334802, 58.934471365638764, 0.6040060572687225], "isController": false}, {"data": ["GET - /public/crocodiles/-0", 9, 0, 0.0, 390.22222222222223, 285, 611, 297.0, 611.0, 611.0, 611.0, 8.387698042870456, 2.9406089818266543, 1.1058000349487418], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,605 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.272727272727273, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,704 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.272727272727273, 1.1111111111111112], "isController": false}, {"data": ["500/Internal Server Error", 40, 90.9090909090909, 44.44444444444444], "isController": false}, {"data": ["The operation lasted too long: It took 11,322 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.272727272727273, 1.1111111111111112], "isController": false}, {"data": ["The operation lasted too long: It took 1,543 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, 2.272727272727273, 1.1111111111111112], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 44, "500/Internal Server Error", 40, "The operation lasted too long: It took 1,605 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,704 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 11,322 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,543 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET - /public/crocodiles/1/-1", 15, 12, "500/Internal Server Error", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET - /public/crocodiles/", 9, 9, "500/Internal Server Error", 8, "The operation lasted too long: It took 11,322 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET - test-api.k6.io", 6, 2, "The operation lasted too long: It took 1,605 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "The operation lasted too long: It took 1,704 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET - /public/crocodiles/1/", 15, 13, "500/Internal Server Error", 12, "The operation lasted too long: It took 1,543 milliseconds, but should not have lasted longer than 1,500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET - /public/crocodiles/-1", 9, 8, "500/Internal Server Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
