import React, { Component } from 'react';

//adding google maps
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { getGeocodingInfo } from '../../api/google.geocoding';

export const API_KEY = 'AIzaSyCiI9shqkKiKx8rs57v02JoWtKfP2aSyHk';

const MAP_SIZE = {
  width: '400px',
  height: '400px',
  padding: '20px'
}

class Maps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
      location: {
        lat: 0,
        lng: 0
      },
      loaded: false
    }
    //binding to event handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);

  }

  componentWillMount(){
    const { address } = this.props;
    getGeocodingInfo(API_KEY, address, (res) => {
      this.setState({ location: res.data.results.length > 0 ? res.data.results[0].geometry.location : {
        lat: 0,
        lng: 0
      }, loaded: true })
    })
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }

  //for maps

  render() {
    const { location, loaded } = this.state;
    const { address } = this.props;

    if (loaded) {
      return (
        <div
          style={MAP_SIZE}
        >
          < Map
            google={this.props.google}
            onClick={this.onMapClick}
            zoom={14}
            style={MAP_SIZE}
            initialCenter={{
              lat: location.lat,
              lng: location.lng
            }}
            loaded={loaded}
          >
            <Marker
              onClick={this.onMarkerClick}
              mapCenter={{
                lat: location.lat,
                lng: location.lng
              }}
              name={address}
            />
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}
            >
              <div>
                <h4>{this.state.selectedPlace.name}</h4>
              </div>
            </InfoWindow>
          </Map>
        </div>
      )
    }else{
      return <div />
    }
  }
}

export default GoogleApiWrapper({
  apiKey: API_KEY
})(Maps);

