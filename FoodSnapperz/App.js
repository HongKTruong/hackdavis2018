/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
  CameraRoll,
  Image
} from 'react-native';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-spinkit';
import nutrition from './nutrition.json';

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
        aspect={Camera.constants.Aspect.fill}
        captureQuality={Camera.constants.CaptureQuality.medium}>
        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
      </Camera>
      </View>
    );
  }

  // console.log(nutrition);
  // Source: https://github.com/dividezero/whattheheckisthis
  takePicture() {

    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => {

        // TODO: Resizing image was causing a lot of issues; figure out why?
         // resizeImage(data.path, (resizedImageUri) => {

          // Google wants a base64-formatted image if the API is not given an uploaded image or URL
          // NativeModules.RNImageToBase64.getBase64String(resizedImageUri, async(err, base64) => {
          NativeModules.RNImageToBase64.getBase64String(data.path, async(err, base64) => {
            if (err) {
              console.error(err)
            }
            console.log('Converted to base64');
            console.log(nutrition);

            // Wait for Google to return json labels
            let result = await checkForLabels(base64);
            console.log(result);

            // Remove results with confidence levels lower than 0.3
            let filteredResult = filterLabelsList(result.responses[0], 0.5);

            // Display every filtered result in an alert
            //displayResult(filteredResult);
          })
        // })
      })
      .catch(err => console.error(err));
  }
}

async function checkForLabels(base64) {
    return await
        fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBIfaUsi0tnYkY4sc7SpS0-BduLIP1Nms8', {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": base64
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION",
                                "maxResults": 10
                            },
                            {
                                "type": "WEB_DETECTION",
                                "maxResults": 10
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

function filterLabelsList(response, minConfidence = 0) {
    let resultArr = [];
    nutrition.forEach((food) => {
       // response.labelAnnotations.forEach(label) => {
         console.log("ASBDKBDKSABKBDSA" + food.name)
         response.forEach((label) => {
          console.log("MMMMMMMMMMMMMMMMMM" + label.description)
         });
    //     if (nutrition[i].name === label.description) {
    //       console.log("NAME: " + nutrition[i].name + "DESC: " + label.description);
    //       resultArr.push(label.description);
    //     }
  
       
     });


    // response.labelAnnotations.forEach((label) => {
    //     if (label.score > minConfidence) {
    //         resultArr.push(label);
    //     }
    // });

    // response.webDetection.webEntities.forEach((label) => {
    //   resultArr.push(label);
    // });
    return resultArr;
}

function displayResult(filteredResult) {

  let labelString = '';
  let count = 1;

  // console.log("THIS HAS" + filteredResult.length + "RESULTS SSSSSSSSSSSSSSSS");

  filteredResult.forEach((label) => {
    labelString += label + ' ,';
    console.log(label);
  });

  Alert.alert(
    labelString
  );
}


//     let labelString = '';
//     let count = 1;
//     if (filteredResult.length > 1) {
//         labelString = '... or it might be ';
//         filteredResult.forEach((resLabel) => {
//             if (count == filteredResult.length) {
//                 labelString += 'a ' + resLabel.description + '! I\'m pretty sure! Maybe.'
//             } else if (count == 1) {

//             } else {
//                 labelString += 'a ' + resLabel.description + ' or '
//             }
//             count++;
//         });

//         Alert.alert(
//             'Its a ' + filteredResult[0].description + '!',
//             labelString
//         );
//     } else {
//         Alert.alert(
//             'Its a ' + filteredResult[0].description + '!'
//         );
//     }
// }

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
