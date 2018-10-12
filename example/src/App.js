import React, { Component } from 'react'
import VideoPlayerSand from './components/video/VideoPlayer';
import VideoStats from './components/statics/data/VideoStats';

import ExampleComponent from 'video-metrics'

export default class App extends Component {
  render () {
    return (
      <div>
        <VideoPlayerSand/>
        <VideoStats/>
      </div>
    )
  }
}
