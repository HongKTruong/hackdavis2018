/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
  Alert,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
  CameraRoll,
  Image,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import Camera from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-spinkit';
import nutrition from '../nutrition.json';
import ImagePicker from 'react-native-image-picker';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class first extends React.Component  {
  static navigationOptions = {
    tabBarLabel: 'Camera',
    tabBarIcon: ({tintColor}) => (
      <Image
        source={require('../image/photo-camera.png')}
        style={{width: 22, height: 22, tintColor: 'white'}}>
      </Image>
    )
  }
  state = { ImageSource: null,};

  selectPhotoTapped() {
  const options = {
    quality: 1.0,
    maxWidth: 10,
    maxHeight: 10,
    storageOptions: {
      skipBackup: true
    }
  };

  ImagePicker.showImagePicker(options, async(response) => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled photo picker')
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error)
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton)
        }
        else {
            //Wait for Google to return json labels
            let result = await checkForLabels(response.data)
            console.log("POOP" + result)

            //Remove results with confidence levels lower than 0.3
            let filteredResult = filterLabelsList(result.responses[0], 0.5);

            //Display every filtered result in an alert
            displayResult(filteredResult);
        }
    });
  }



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
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>

        <View style={styles.ImageContainer}>

        { this.state.ImageSource === null ? <Text>Upload</Text> :
          <Image style={styles.ImageContainer} source={this.state.ImageSource} />
        }

        </View>
        </TouchableOpacity>
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

          // Google wants a base64-formatted image if the API is not given an uploaded image or URL
          NativeModules.RNImageToBase64.getBase64String(data.path, async(err, base64) => {
            if (err) {
              console.error(err)
            }
            console.log('Converted to base64');

            // Wait for Google to return json labels
            let result = await checkForLabels(base64);
            console.log(result);

            // Remove results with confidence levels lower than 0.3
            let filteredResult = filterLabelsList(result.responses[0], 0.5);

            // Display every filtered result in an alert
            displayResult(filteredResult);
          })
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
         response.labelAnnotations.forEach((label) => {
          if (food.name === label.description) {
            resultArr.push(label.description)
            return resultArr;
          }
        });

        response.webDetection.webEntities.forEach((label) => {
          if (food.name === label.description) {
            resultArr.push(label.description)
            return resultArr;
          }
        });
     });
    console.log("LALALALLAALALA" + resultArr)

    return resultArr;
}

function displayResult(filteredResult) {

  let labelString = '';

  if (filteredResult.length == 0) {
    labelString += "No matches"
  }
  else {
    labelString += filteredResult[0];
  }

  Alert.alert(
    labelString
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  ImageContainer: {
  borderRadius: 10,
  width: 50,
  height: 50,
  borderColor: '#9B9B9B',
  borderWidth: 1 / PixelRatio.get(),
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#CDDC39',

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
