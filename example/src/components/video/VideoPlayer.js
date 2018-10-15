import React from 'react'
import { sniffVideoMetrics } from '@wyscout/video-metrics';
import VideoPlayer from '@wyscout/video-player';


class VideoPlayerSand extends React.Component {

  componentDidMount = () => {
    sniffVideoMetrics();
    //test
  }

  _onCloseVideo = () => {

  }

  _onShareClips = () => {

  }

  _onDownloadClips = () => {

  }
  rendeWyscoutVpl () {
    return (
      <div style={{'width' : '50%', 'left' : '25%', 'position' : 'relative'}}>
       <VideoPlayer
          onClosePlayer={this._onCloseVideo}
          onShareClips={this._onShareClips}
          onDownloadClips={this._onDownloadClips}
          token={'davideg'}
          userId={120619}
          embedded
          groupId={200}
          subgroupId={1124}
          language={'it'}
          source={'match'}
          input={'2120720'}
          autoplay
          quality="fullhd"
          hideTools
      />
      </div>
    )
  }

  render() {
    return (
      <div style={{'width' : '50%', 'left' : '20%', 'position' : 'relative', 'top' : '15px'}}>
      <video id='video' controls="controls" preload='true'
          width="1000" poster="http://media.w3.org/2010/05/sintel/poster.png">
          <source id='mp4' src="http://media.w3.org/2010/05/sintel/trailer.mp4" type='video/mp4'/>
          <source id='webm' src="http://media.w3.org/2010/05/sintel/trailer.webm" type='video/webm'/>
          <source id='ogv' src="http://media.w3.org/2010/05/sintel/trailer.ogv" type='video/ogg'/>
        </video>
      </div>
    )
  }
}

export default VideoPlayerSand;
