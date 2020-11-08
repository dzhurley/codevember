mapboxgl.accessToken = 'pk.eyJ1IjoiZHpodXJsZXkiLCJhIjoiY2toOWZ4YW02MGpjbTJyazgxZHQzMWJ3ZSJ9.OKAaxFFdi1yZ2P4LruDRLA';

const viridis = [
  '#440154',
  '#482475',
  '#414487',
  '#355f8d',
  '#2a788e',
  '#21908d',
  '#22a884',
  '#42be71',
  '#7ad151',
  '#bddf26',
  '#bddf26',
];

const map = new mapboxgl.Map({
  container: 'map',
  style: {
    version: 8,
    name: 'Dark',
    sources: {
      mapbox: {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v8',
      },
    },
    sprite: 'mapbox://sprites/mapbox/dark-v10',
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: { 'background-color': '#111' },
      },
      {
        id: 'water',
        source: 'mapbox',
        'source-layer': 'water',
        type: 'fill',
        paint: { 'fill-color': '#2c2c2c' },
      },
    ],
  },
  zoom: 1,
});

map.on('load', () => {
  map.addSource('aq-source', {
    type: 'geojson',
    data: window.data,
  });

  const step = 50 / viridis.length;
  map.addLayer({
    id: 'aq',
    source: 'aq-source',
    type: 'circle',
    layout: {
      'circle-sort-key': ['get', 'value'],
    },
    paint: {
      'circle-blur': 0.7,
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'value'],
        ...viridis.reduce(
          (pairs, color, index) => pairs.concat(index * step, color),
          [],
        ),
      ],
      'circle-opacity': 0.5,
      'circle-radius': 14,
    },
  });
});
