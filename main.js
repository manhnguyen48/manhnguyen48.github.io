// function initMap() {
var stamen = L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png", { "attribution": "Map tiles by \u003ca href=\"http://stamen.com\"\u003eStamen Design\u003c/a\u003e, under \u003ca href=\"http://creativecommons.org/licenses/by/3.0\"\u003eCC BY 3.0\u003c/a\u003e. Data by \u0026copy; \u003ca href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": true, "opacity": 1, "subdomains": "abc", "tms": false });
map = L.map('mapid', {
    center: [51.524012, -0.100449],
    crs: L.CRS.EPSG3857,
    zoom: 12,
    zoomControl: true,
    preferCanvas: true,
    zoomSnap: 1,
    layers: [stamen],
});
L.control.scale().addTo(map);

layerControl = L.control.layers({
    'Background Map': stamen,
    // 'autoZIndex': true,
}, {}).addTo(map);

L.Control.geocoder({ placeholder: 'Search your postcode...', position: 'topleft' }).addTo(map);
// }


var legend_OA = L.control({ position: 'bottomright' });
legend_OA.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'maplegend');
    div.innerHTML = `<div class=' legend-title '>Output area hour on the Clock Face</div>
        <div class='legend-scale '>
            <ul class='legend-labels '>
                <li><span style='background:#6baed6;opacity:0.7; '></span>1.0 o'clock</li>
                <li><span style='background:#2171b5;opacity:0.7;'></span>2.0 o'clock</li>
                <li><span style='background:#bdd7e7;opacity:0.7;'></span>3.0 o'clock</li>
                <li><span style='background:#9e9ac8;opacity:0.7;'></span>4.0 o'clock</li>
                <li><span style='background:#810f7c;opacity:0.7;'></span>5.0 o'clock</li>
                <li><span style='background:#8856a7;opacity:0.7;'></span>6.0 o'clock</li>
                <li><span style='background:#de2d26;opacity:0.7;'></span>7.0 o'clock</li>
                <li><span style='background:#a50f15;opacity:0.7;'></span>8.0 o'clock</li>
                <li><span style='background:#fc9272;opacity:0.7;'></span>9.0 o'clock</li>
                <li><span style='background:#fcbba1;opacity:0.7;'></span>10.0 o'clock</li>
                <li><span style='background:#e6550d;opacity:0.7;'></span>11.0 o'clock</li>
                <li><span style='background:#fd8d3c;opacity:0.7;'></span>12.0 o'clock</li>
            </ul>
        </div>`
    return div
};
var legend_con = L.control({ position: 'bottomright' });

legend_con.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'maplegend');
    div.innerHTML = `<div class = 'legend-title'> Conservative Factor </div> <div class='legend-scale '> <ul class='legend-labels '>
                <li><span style='background:#e5eff9;opacity:0.7; '></span>0-10 percentile</li>
                <li><span style='background:#d3e4f3;opacity:0.7;'></span>10-20 percentile</li>
                <li><span style='background:#bfd8ed;opacity:0.7;'></span>20-30 percentile</li>
                <li><span style='background:#a1cbe2;opacity:0.7;'></span>30-40 percentile</li>
                <li><span style='background:#7db8da;opacity:0.7;'></span>40-50 percentile</li>
                <li><span style='background:#5ca4d0;opacity:0.7;'></span>50-60 percentile</li>
                <li><span style='background:#3f8fc5;opacity:0.7;'></span>60-70 percentile</li>
                <li><span style='background:#2676b8;opacity:0.7;'></span>70-80 percentile</li>
                <li><span style='background:#135fa7;opacity:0.7;'></span>80-90 percentile</li>
                <li><span style='background:#08488e;opacity:0.7;'></span>90-100 percentile</li>
        </ul> </div>`

    return div;
};


legend_OA.addTo(map);
legend_con.addTo(map);
legend_OA.remove();

var layerToLegendMapping = {
    "Conservative Factor": legend_con,
    "Clock Face hour": legend_OA,
}

function legendAdd(event) {
    var layername = event.name;
    map.addControl(layerToLegendMapping[layername]);
}

function legendRemove(event) {
    var layername = event.name;
    map.removeControl(layerToLegendMapping[layername]);
}
map.on('overlayadd', legendAdd);
map.on('overlayremove', legendRemove);

function getColor(d) {
    return d > 90 ? '#08488e' :
        d > 80 ? '#135fa7' :
        d > 70 ? '#2676b8' :
        d > 60 ? '#3f8fc5' :
        d > 50 ? '#5ca4d0' :
        d > 40 ? '#7db8da' :
        d > 30 ? '#a1cbe2' :
        d > 20 ? '#bfd8ed' :
        d > 10 ? '#d3e4f3' :
        '#e5eff9';
}

// p > 90 ? '#08488e' : p > 80 ? '#135fa7' : p > 70 ? '#2676b8' : p > 60 ? '#3f8fc5' : p > 50 ? '#5ca4d0' : p > 40 ? '#7db8da' : p > 30 ? '#a1cbe2' : p > 20 ? '#bfd8ed' : p > 10 ? '#d3e4f3' : '#e5eff9'
function drawCanvasLayer(url, name_1, name_2) {
    var name_1 = name_1 || "canvas";
    var name_2 = name_2 || "canvas";


    corslite(url, function(err, resp) {
        var json = JSON.parse(resp.response);
        var clockface_layer = L.vectorGrid.slicer(json, {
            maxZoom: 18,
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                sliced: function(properties, zoom) {
                    var p = properties.hour;
                    return {
                        fillColor: p === 1.0 ? '#6baed6' : p === 2.0 ? '#2171b5' : p === 3.0 ? '#bdd7e7' : p === 4.0 ? '#9e9ac8' : p === 5.0 ? '#810f7c' : p === 6.0 ? '#8856a7' : p === 7.0 ? '#de2d26' : p === 8.0 ? '#a50f15' : p === 9.0 ? '#fc9272' : p === 10.0 ? '#fcbba1' : p === 11.0 ? '#e6550d' : p === 12.0 ? '#fd8d3c' : 'black',
                        fillOpacity: 0.7,
                        stroke: true,
                        fill: true,
                        color: 'black',
                        weight: 0,
                    }
                }
            },
            interactive: false
        })
        var con_factor = L.vectorGrid.slicer(json, {
            maxZoom: 18,
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                sliced: function(properties, zoom) {
                    var p = properties.conservative_factor;
                    return {
                        fillOpacity: 0.7,
                        stroke: true,
                        fill: true,
                        color: 'black',
                        weight: 0,
                        fillColor: getColor(p)
                    }
                }
            },
            interactive: false
        })

        layerControl.addOverlay(clockface_layer, name_1);
        layerControl.addOverlay(con_factor, name_2);
        // clockface_layer.remove();
        con_factor.addTo(map)
    }, true);
}

function drawInfoLayer(url, name, style_func, onEachFeature, fields_info, aliases_info, color_border) {
    var name = name || "canvas";
    corslite(url, function(err, resp) {
        var json = JSON.parse(resp.response);
        var info_layer = L.geoJson(json, {
            style: function(feature) {
                return {
                    fillColor: '',
                    weight: 2.5,
                    opacity: 1,
                    color: color_border,
                    fillOpacity: 0,
                };
            },
            onEachFeature: onEachFeature
        }).bindTooltip(function(layer) {
            // Convert non-primitive to String.
            let handleObject = (feature) => typeof(feature) == 'object' ? JSON.stringify(feature) : feature;
            let fields = fields_info;
            let aliases = aliases_info;
            return '<table>' +
                String(
                    fields.map(
                        columnname =>
                        `<tr style="text-align: left;">
                    <th style="padding: 4px; padding-right: 10px;">
                        ${aliases[fields.indexOf(columnname)]
                        }
                    </th>
                    <td style="padding: 4px">${handleObject(layer.feature.properties[columnname])
                    }</td></tr>`
                    ).join('')) +
                '</table>'
        }, {
            "sticky": true,
            "direction": "auto",
            // "maxWidth"
        }).addTo(map);

        layerControl.addOverlay(info_layer, name);
        info_layer.remove();
    })

}

function main() {
    // initMap();
    let field_constituencies = ["pcon17nm", "turnout17", "con17", "lab17", "ld17", "green17"],
        alias_constituencies = ["Seat: ", "Turnout: ", "Con: ", "Lab: ", "LibDem: ", "Green: "],
        field_LA = ["lad17nm", 'Pct_Leave', 'Pct_Remain'],
        alias_LA = ["Local Authority: ", "Leave: ", "Remain: "],
        field_ward = ["wd17nm", "PCON16NM", "LAD16NM"],
        alias_ward = ["Ward: ", "Seat: ", "Local Authority: "];

    drawCanvasLayer("./geojson/London_updated.json", 'Clock Face hour', 'Conservative Factor');
    drawInfoLayer("./geojson/London_constituency.json", "Constituencies", style, onEachFeature, field_constituencies, alias_constituencies, 'black');
    drawInfoLayer("./geojson/London_LA.json", "Local Authorities", style, onEachFeature, field_LA, alias_LA, '#900C3F');
    drawInfoLayer("./geojson/London_ward.json", 'Wards', style, onEachFeature, field_ward, alias_ward, 'black');
}


function style(feature) {
    return {
        fillColor: '',
        weight: 2.5,
        opacity: 1,
        color: 'black',
        fillOpacity: 0,
    };
}


function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        click: zoomToFeature
    });
}

main();