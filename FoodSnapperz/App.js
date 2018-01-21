/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-spinkit';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {

  render() {
    return (
      <View style={styles.container}>
      <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        aspect={Camera.constants.Aspect.fill}>
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
      </Camera>
      </View>
    );
  }

  // Source: https://github.com/dividezero/whattheheckisthis
  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => {

        // TODO: Resizing image was causing a lot of issues; figure out why?
         // resizeImage(data.path, (resizedImageUri) => {
          NativeModules.RNImageToBase64.getBase64String(data.path, async(err, base64) => {
            if (err) {
              console.error(err)
            }
            console.log('Converted to base64');

            let result = await checkForLabels(base64);
            console.log(result);
          })
        // })
      })
      .catch(err => console.error(err));
  }
}

function resizeImage(path, callback, width = 640, height = 480) {
    ImageResizer.createResizedImage(path, width, height, 'JPEG', 80).then((resizedImageUri) => {
        callback(resizedImageUri);

    }).catch((err) => {
        console.error(err)
    });
}

async function checkForLabels(base64) {

    return await
        fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBp8agW3SChKRVtmAWSUSxdqRgdxzmigxs', {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": base64
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION"
                            }
                        ]
                    }
                ]
            })
        }).then((response) => {
            return response.json();
        }, (err) => {
            console.error('promise rejected')
            console.error(err)
        });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  preview: {
   flex: 1,
   justifyContent: 'flex-end',
   alignItems: 'center'
 },
  capture: {
   flex: 0,
   backgroundColor: '#fff',
   borderRadius: 5,
   color: '#000',
   padding: 10,
   margin: 40
 }
});
