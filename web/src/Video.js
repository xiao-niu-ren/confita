import React from "react";
import Player from 'aliplayer-react';
import * as Setting from "./Setting";

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      player: null,
    };
  }

  updateVideoSize(width, height) {
    if (this.props.onUpdateVideoSize !== undefined) {
      this.props.onUpdateVideoSize(width, height);
    }
  }

  handleReady(player) {
    let videoWidth = player.tag.videoWidth;
    let videoHeight = player.tag.videoHeight;

    if (this.props.onUpdateVideoSize !== undefined) {
      if (videoWidth !== 0 && videoHeight !== 0) {
        this.updateVideoSize(videoWidth, videoHeight);
      }
    } else {
      videoWidth = this.props.task.video.videoWidth;
      videoHeight = this.props.task.video.videoHeight;
    }

    const myWidth = player.tag.scrollWidth;
    const myHeight = videoHeight * myWidth / videoWidth;

    player.setPlayerSize(myWidth, myHeight);
    this.setState({
      width: myWidth,
      height: myHeight,
    });
  }

  initPlayer(player) {
    player.on('ready', () => {this.handleReady(player)});
  }

  render() {
    const room = this.props.room;

    const config = {
      source: Setting.getStreamingUrl(room),
      width: !Setting.isMobile() ? `${room.videoWidth}px` : "100%",
      height: `${room.videoHeight}px`,
      autoplay: true,
      isLive: true,
      rePlay: false,
      playsinline: true,
      preload: true,
      enableStashBufferForFlv: true,
      stashInitialSizeForFlv: 32,
      controlBarVisibility: "hover",
      useH5Prism: true,
    };

    return (
      <div style={{width: room.videoWidth, height: room.videoHeight, margin: "auto"}}>
        <Player
          config={config}
          onGetInstance={player => {
            // this.initPlayer(player);
          }}
        />
      </div>
    )
  }
}

export default Video;