import React, { Component } from 'react';
import { render } from 'react-dom';
import Rx from 'rx';
import { DOM } from 'rx-dom';
import _ from 'lodash';

import { scrubName } from './utils/dataScrub';

import InputBar from './inputbar';
import Header from './components/Header';
import TruckList from './TruckList';
import LoadingMessage from './components/LoadingMessage';

import { getDistance } from 'geolib';

import { GOOGLE_API_KEY } from './utils/keyconfig'

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      trucks: [],
      errorMessage: ''
    };
  }

  componentDidMount () {
    this.getStateStream();
  }

  getStateStream () {

    // Grab the day and hour. We'll need these to find where the trucks are and which are open

    const day = new Date().getDay();
    const hour = new Date().getHours();

    // Set up the first source stream from event and its loading message

    const addressButton = document.querySelector('.address-button');
    const addressClick$ = Rx.Observable.fromEvent(addressButton, 'click');
    const addressLoadingMessage$ = Rx.Observable.just({loading: 'Getting location from address...'});

    const addressRequest$ = addressClick$
      .concatMap(() => {
        var address = encodeURI(document.querySelector('input').value);
        return DOM.ajax({
          url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+San+Francisco&key=${GOOGLE_API_KEY}`,
          method: 'GET'
        })
          .merge(addressLoadingMessage$);
    });

    const addressLoading$ = addressRequest$.filter(req => req.loading !== undefined);

    // We have fetched the geocoded address, and now need to filter out the loading message

    const addressResponse$ = addressRequest$
      .filter(res => !res.loading)
      .map(res => {
        var coords = JSON.parse(res.response).results[0].geometry.location;
        return Rx.Observable.just({ lat: coords.lat, lon: coords.lng });
      });

    // Set up the second source stream from event and its loading message

    const locationButton = document.querySelector('.location-button');
    const locationClick$ = Rx.Observable.fromEvent(locationButton, 'click');
    const locationMessage$ = Rx.Observable.just({ loading: 'Fetching your current location...'});

    const request$ = locationClick$.concatMap(() => DOM.geolocation.getCurrentPosition().merge(locationMessage$));

    var locationLoading$ = request$.filter(req => req.loading !== undefined);

    var locationResponse$ = request$
      .filter(res => !res.loading)
      .map(position => ({ lat: position.coords.latitude, lon: position.coords.longitude }));

    //HERE IS WHERE WE MERGE THE TO LOC STREAMS;

    const response$ = addressResponse$.merge(locationResponse$);

    const truckRequest$ = response$
      .concatMap(pos => {
        var userPositionSource = Rx.Observable.just({ lat: pos.lat, lon: pos.lon });
        var truckSource = DOM.ajax({
          url: `https://data.sfgov.org/resource/jjew-r69b.json?dayorder=${day}`,
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8000'
          }
        })

        return Rx.Observable.combineLatest(userPositionSource, truckSource, (s1, s2) =>
          ({ user: s1, trucks: s2.response }))
          .merge(Rx.Observable.just({loading: 'Fetching the mobile food data...'}));
      });

    const truckLoading$ = truckRequest$.filter(req => req.loading !== undefined);

    // Merge together all of the loading message streams.

    var loadingMessages$ = Rx.Observable.merge(locationLoading$, truckLoading$, addressLoading$);

    const truckResponse$ = truckRequest$
      .filter(pos => !pos.loading)
      .map(data => {
        return JSON.parse(data.trucks)
        .map(truck => {

          var distance;

          if (truck.latitude && truck.longitude && data.user.lat && data.user.lon) {
            distance = getDistance(
              { latitude: parseFloat(truck.latitude), longitude: parseFloat(truck.longitude) },
              { latitude: data.user.lat, longitude: data.user.lon }
            );
          } else {
            distance = ":-("
          }


          var name = scrubName(truck.applicant)

          return {
            applicant: name,
            truckLat: truck.latitude,
            truckLon: truck.longitude,
            userLat: data.user.lat,
            userLon: data.user.lon,
            distance: distance
          };

        });
      });


    truckResponse$.merge(loadingMessages$).subscribe(
      data => {
        if(data.loading) {
          this.setState({loadingMessage: data.loading});
        } else {
          this.setState({
            trucks: data,
            loadingMessage: null
          });
        }
      },
      err => {
        console.error(err);
        this.setState({
          errorMessage: err,
          trucks: [],
          loadingMessage: null
        })
      },
      complete => { console.log('complete') }
    );
  }

  render () {
    return (
      <div className="main--container">
        <Header />
        <InputBar />
        <LoadingMessage message={this.state.loadingMessage} />
        <TruckList trucks={this.state.trucks}/>
      </div>
    );
  }
 }

render(<App/>, document.getElementById('root'));
