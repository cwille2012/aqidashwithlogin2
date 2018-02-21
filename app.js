var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);

import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { json as requestJson } from 'd3-request';
import index from 'deck.gl';

const MAPBOX_TOKEN = "pk.eyJ1IjoiY3dpbGxlMjAxMiIsImEiOiJjajJxdWJyeXEwMDE5MzNydXF2cm1sbDU1In0.kCKIz6Ivh3EfNOmEfTANOA"; // eslint-disable-line


var app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 9600);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

// build mongo database connection url //

var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'node-login';

var dbURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;
if (app.get('env') == 'live') {
    // prepend url with authentication credentials // 
    dbURL = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + dbHost + ':' + dbPort + '/' + dbName;
}

app.use(session({
    secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ url: dbURL })
}));

require('./app/server/routes')(app);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


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

        function httpGet(theUrl) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            xmlHttp.send(null);
            return xmlHttp.responseText;
        }

        var response = httpGet('http://ec2-18-220-29-245.us-east-2.compute.amazonaws.com:3000/mapdata');

        console.log(JSON.parse(response));
        response = JSON.parse(response);

        this.state.data = response;

        requestJson('http://ec2-18-220-29-245.us-east-2.compute.amazonaws.com:3000/data/location-icon-mapping.json', (error, response) => {
            if (!error) {
                this.setState({ iconMapping: response });
            }
        });
        this._onHover = this._onHover.bind(this);
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

    _onHover({ x, y, object }) {
        this.setState({ x, y, hoveredObject: object });
    }

    _onMouseMove(evt) {
        if (evt.nativeEvent) {
            this.setState({ mousePosition: [evt.nativeEvent.offsetX, evt.nativeEvent.offsetY] });
        }
    }

    _onMouseEnter() {
        this.setState({ mouseEntered: true });
    }

    _onMouseLeave() {
        this.setState({ mouseEntered: false });
    }

    _renderTooltip() {
        const { x, y, hoveredObject } = this.state;
        var myx = x + 15;
        var myy = y + 15;

        if (!hoveredObject) {
            return null;
        }

        var tooltipExists = !!document.getElementById('tooltip');

        var hoveredObjectHTML = hoveredObject.address;

        if (tooltipExists) {
            document.getElementById('tooltip').style.position = "absolute";
            document.getElementById('tooltip').style.zIndex = 99999;
            document.getElementById('tooltip').style.color = '#fff';
            document.getElementById('tooltip').style.background = 'rgba(0, 0, 0, 0.8)';
            document.getElementById('tooltip').style.padding = '4px';
            document.getElementById('tooltip').style.fontSize = '14px';
            document.getElementById('tooltip').style.maxWidth = '300px';
            document.getElementById('tooltip').style.left = myx + 'px';
            document.getElementById('tooltip').style.top = myy + 'px';
            document.getElementById('tooltip').style.cursor = 'pointer';
            document.getElementById('tooltip').setAttribute('text-decoration', 'none!important');
            document.getElementById('tooltip').setAttribute('max-width', '300px!important');
        }

        console.log(hoveredObject);

        return ( < div id = "tooltip" >

            <
            div > { hoveredObject.message } < /div>  <
            div > { `Date: ${hoveredObject.date}` } < /div>  <
            div > { `Message: ${hoveredObject.message}` } < /div>  <div><img src={hoveredObject.img} alt="Failed to load" id="image" style={{maxWidth: '300px'}}></img > < /div>< /
            div >
        );
    }

    render() {
        const { viewport, data, iconMapping, mousePosition, mouseEntered } = this.state;
        if (!data) {
            return null;
        }
        return ( <
            div onMouseMove = { this._onMouseMove.bind(this) }
            onMouseEnter = { this._onMouseEnter.bind(this) }
            onMouseLeave = { this._onMouseLeave.bind(this) } > { this._renderTooltip() } <
            MapGL {...viewport }
            mapStyle = "mapbox://styles/mapbox/satellite-streets-v10"
            onViewportChange = { this._onViewportChange.bind(this) }
            mapboxApiAccessToken = { MAPBOX_TOKEN } >
            <
            DeckGLOverlay viewport = { viewport }
            data = { data }
            iconAtlas = "data/location-icon-atlas.png"
            iconMapping = { iconMapping }
            showCluster = { true }
            mousePosition = { mousePosition }
            mouseEntered = { mouseEntered }
            onHover = { this._onHover.bind(this) }
            />

            <
            /MapGL>

            <
            /div>
        );
    }
}
if (!!document.getElementById('mapHolder')) {
    render( < Root / > , document.getElementById('mapHolder').appendChild(document.createElement('div')));
}