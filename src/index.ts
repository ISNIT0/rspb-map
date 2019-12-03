import 'leaflet/dist/leaflet.css';
import './index.css';
import * as L from 'leaflet';

interface RSPBLayer {
    displayName: string,
    url: string,
    data?: Promise<any>,
    layer?: L.Layer,
    type: 'geoJSON',
    style?: any,
    process?: (data: any) => any,
}

const rspbLayers: RSPBLayer[] = [
    {
        displayName: 'RSPB Reserves',
        url: '/public/RSPB_Reserves.geojson',
        type: 'geoJSON',
        style: { color: 'lightblue' }
    },
    {
        displayName: 'IBAs',
        url: '/public/IBAs.geojson',
        type: 'geoJSON',
        style: { color: 'green' },
    },
    {
        displayName: 'DEFRA Flood Risk',
        url: '/public/DEFRA_Flood_Risk.geojson',
        type: 'geoJSON',
        style: { color: 'red' },
    },
    {
        displayName: 'Constituencies',
        url: '/public/constituencies.geojson',
        type: 'geoJSON',
        style: { color: 'pink' },
    },
    {
        displayName: 'Planning Applications',
        url: `/public/planit-sample.geojson`,
        // url: `https://www.planit.org.uk/api/applics/geojson?pg_sz=50&compress&limit=50&end_date=${(new Date()).toISOString()}`,
        type: 'geoJSON',
    },
];

const map = L.map('map').setView([51.505, -0.09], 13);

(window as any).leafletMap = map;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function loadAndAddLayer(layer: RSPBLayer) {
    if (!layer.layer) {
        if (!layer.data) {
            layer.data = fetch(layer.url).then(r => r.json());
            if(layer.process) {
                layer.data = layer.process(layer.data);
            }
        }
        const data = await layer.data;

        layer.layer = L.geoJSON(data, {
            style: () => {
                return layer.style;
            },
            onEachFeature: function (feature: any, layer: any) {
                if (feature.properties) {
                    layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                        return k + ": " + feature.properties[k];
                    }).join("<br />"), {
                        maxHeight: 200
                    });
                }
            }
        });
    }

    if (map.hasLayer(layer.layer)) {
        map.removeLayer(layer.layer);
    } else {
        layer.layer.addTo(map);
        map.fitBounds((layer.layer as L.GeoJSON).getBounds());
    }
}

const $controls = document.querySelector('.controls');
rspbLayers.forEach((layer) => {
    const $button = document.createElement('button');
    $button.textContent = layer.displayName;
    $button.onclick = function () {
        loadAndAddLayer(layer);
    };
    if (layer.style) {
        $button.style.background = layer.style.color;
    }
    $controls.append($button);
});
