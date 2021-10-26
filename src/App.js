import React, { Component } from 'react';
import Logo from './components/Logo/Logo';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

// api for Clarifai.com
const app = new Clarifai.App({
  apiKey: '88d85d28b1ce415ba1ca69d563f5d31c'
});


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '', // input state
      imageURL:'', // image URL state
      box: {}, // box 
      route: 'signin', // route state (keeps track of where we are on the page)
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})

    app.models.predict(
        Clarifai.FACE_DETECT_MODEL, this.state.input
        )
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
    }

    onRouteChange =(route) => {
      if(route === 'signout') {
        this.setState({isSignedIn: false})
      }
      else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
    }


  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          <Logo />
          {route === 'home' 
            ? <div>
                <Rank />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition box={box} imageURL={imageURL} />
              </div>
            : (
              route === 'signin'
              ? <Signin onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
            )
          }
        </div>
    );
  }
}

export default App;