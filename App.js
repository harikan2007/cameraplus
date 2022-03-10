import { setStatusBarBackgroundColor, StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

export default function App() {
  
  const [hasPermission, setHasPermission] = useState(null);
  const [hasPermissionaudio, setHasPermissionaudio] = useState(null);
  const [recordinprogress, setRecordinprogress] = useState(false);
  const [captureVideo, setCapturedVideo] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
 
  const [recording, setRecording] = useState(false);
  let camera = Camera;
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync() ;
     // const { status2 } = await Camera.getMicrophonePermissionsAsync();
      setHasPermission(status === 'granted');
     // setHasPermissionaudio(status2=== "granted");
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestMicrophonePermissionsAsync() ;
     // const { status2 } = await Camera.getMicrophonePermissionsAsync();
      setHasPermission(status === 'granted');
     // setHasPermissionaudio(status2=== "granted");
    })();
  }, []);
 /* useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync(writeOnly) ;
     // const { status2 } = await Camera.getMicrophonePermissionsAsync();
      setHasPermission(status === 'granted');
     // setHasPermissionaudio(status2=== "granted");
    })();
  }, []);*/
    
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  /*if (hasPermissionaudio === null) {
    return <View />;
  }
  if (hasPermissionaudio === false) {
    return <View style={{paddingTop:20}}><Text>No access to audio</Text></View>;
  }*/
  

  const __savevideo = ()=>{} 
  //async() => {
  //  await MediaLibrary.saveToLibraryAsync(captureVideo.uri)
  //  setPreviewVisible(false)
  //  setCapturedVideo(null)
  //}
 const __sharevideo = async() =>{
    await Sharing.shareAsync(captureVideo.uri)
    console.log(captureVideo)
    setCapturedVideo(null)
 }
 
  const __retakevideo = () => {
    setCapturedVideo(null)
    setPreviewVisible(false)}
  return (
    <View style={styles.container}>
      { captureVideo && previewVisible ? (
        <CameraPreview photo={captureVideo} retakevideo={__retakevideo} savevideo={__savevideo} sharevideo={__sharevideo} />
      ):(
      <Camera style={styles.camera} 
      type="back" 
      flashMode="auto"
      ref={(r) => {
        camera = r
      }}
      >
        <View style={styles.buttonContainer}>
        <View
        style={{
        alignSelf: 'center',
        flex: 1,
        alignItems: 'center'
        }}
        >
         
            <TouchableOpacity
            style={styles.button}
            onPress={async() => {
              if(!recording){
                setRecording(true)
              setCapturedVideo( await camera.recordAsync());
            } else {
                setRecording(false)
                camera.stopRecording()
                console.log(captureVideo)
                setPreviewVisible(true)
            }
          }}>
            <Text style={styles.text}> {recording ? "stop":"start"} </Text>
          </TouchableOpacity>
          
          
          </View>
        </View>
      </Camera>)}
    </View>
  );
}
const CameraPreview = ({photo, savevideo, retakevideo, sharevideo}) => {
  const vvideo = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
    <View
      style={{
        backgroundColor: '#ecf0f1',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >

      <Video
      ref={vvideo}
      style={styles.video}
      source={{uri: photo && photo.uri}}
      useNativeControls
      resizeMode="contain"
      isLooping
      onPlaybackStatusUpdate={status => setStatus(() => status)}
    />
    <View style={styles.buttons}>
    <TouchableOpacity
            onPress={retakevideo}
            style={{
              width: 130,
              height: 40,

              alignItems: 'center',
              borderRadius: 4
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 20
              }}
            >
              Re-take
            </Text>
            </TouchableOpacity>
    {  /*<Button
        title={status.isPlaying ? 'Pause' : 'Play'}
        onPress={() =>
          status.isPlaying ? vvideo.current.pauseAsync() : vvideo.current.playAsync()
        }
      />*/}
      <TouchableOpacity
            onPress={sharevideo}
            style={{
              width: 130,
              height: 40,

              alignItems: 'center',
              borderRadius: 4
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 20
              }}
            >
              Share
            </Text>
            </TouchableOpacity>
      {/* <TouchableOpacity
            onPress={savevideo}
            style={{
              width: 130,
              height: 40,

              alignItems: 'center',
              borderRadius: 4
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 20
              }}
            >
              save photo
            </Text>
            </TouchableOpacity>*/}
    </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    
    backgroundColor: 'transparent',
    position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        padding: 20,
        justifyContent: 'space-between'
  },
  button: {
    flex: 0.1,
    width: 70,
            height: 70,
            bottom: 0,
            borderRadius: 50,
            backgroundColor: '#fff',
      alignItems:"center",
      justifyContent:"center",
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  video: {
    flex:1,
    alignSelf: 'center',
    width: 380,
    height: 500,
    
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});