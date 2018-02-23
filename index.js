import DeckGL, { IconLayer } from 'deck.gl';

const MAPBOX_TOKEN = "pk.eyJ1IjoiY3dpbGxlMjAxMiIsImEiOiJjajJxdWJyeXEwMDE5MzNydXF2cm1sbDU1In0.kCKIz6Ivh3EfNOmEfTANOA"; // eslint-disable-line

const DATA_URL =
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json';


const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 32, height: 32, mask: true }
};

const App = ({ data, viewport }) => {

        /**
         * Data format:
         * [
         *   {position: [-122.4, 37.7], icon: 'marker', size: 24, color: [255, 0, 0]},
         *   ...
         * ]
         */
        const layer = new IconLayer({
            id: 'icon-layer',
            data,
            iconAtlas: '/app/public/mapdata/icon.png',
            iconMapping: ICON_MAPPING
        });

        return ( < DeckGL {...viewport }
            layers = {
                [layer]
            }
            />);
        };