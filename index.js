/* global window,document */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { json as requestJson } from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data CSV
const DATA_URL =
    './mapdata/mapdata.json'; // eslint-disable-line

/*
class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                ...DeckGLOverlay.defaultViewport,
                width: 500,
                height: 500
            },
            data: null,
            iconMapping: null
        };

        requestJson(DATA_URL, (error, response) => {
            if (!error) {
                this.setState({ data: response });
            }
        });
        requestJson('./mapdata/location-icon-mapping.json', (error, response) => {
            if (!error) {
                this.setState({ iconMapping: response });
            }
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize.bind(this));
        this._resize();
    }

    _resize() {
        this._onViewportChange({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    _onViewportChange(viewport) {
        this.setState({
            viewport: {...this.state.viewport, ...viewport }
        });
    }

    render() {
        const { viewport, data, iconMapping } = this.state;

        return ( <
            MapGL {...viewport }
            mapStyle = "mapbox://styles/mapbox/dark-v9"
            onViewportChange = { this._onViewportChange.bind(this) }
            mapboxApiAccessToken = { MAPBOX_TOKEN } >
            <
            DeckGLOverlay viewport = { viewport }
            data = { data }
            iconAtlas = "mapdata/location-icon-atlas.png"
            iconMapping = { iconMapping }
            showCluster = { true }
            /> < /
            MapGL >
        );
    }
}
*/


const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 32, height: 32, mask: true }
};

var data = { position: [-122.4, 37.7], icon: 'marker', size: 24, color: [255, 0, 0] };

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
            iconAtlas: './mapdata/icon.png',
            iconMapping: ICON_MAPPING
        });

        return ( < DeckGL {...viewport }
            layers = {
                [layer]
            }
            />);
        };

        if (!!document.getElementById('mapHolder')) {
            render( < Root / > , document.getElementById('mapHolder').appendChild(document.createElement('div')));
        }