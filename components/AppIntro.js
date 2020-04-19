import * as React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

const slides = [
  {
    key: 'screen1',
    title: '10 000 hours',
    text: 'It takes ~10 000 hours of practice\nto master a goal',
    image: require('../assets/images/intro/screen-1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'screen2',
    title: 'TenK',
    text: 'TenK helps you track your progress\ntowards your goals',
    image: require('../assets/images/intro/screen-2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'screen3',
    title: 'Goals',
    text: 'Add a goal you want to master',
    image: require('../assets/images/intro/screen-3.png'),
    backgroundColor: '#ff5b5b',
  },
  {
    key: 'screen4',
    title: 'Track your progress',
    text: 'Start the stopwatch (or timer) to\ntrack your progress',
    image: require('../assets/images/intro/screen-4.png'),
    backgroundColor: '#8496ff',
  },
  {
    key: 'screen5',
    title: 'Profit!',
    text: 'Become a master',
    image: require('../assets/images/intro/screen-5.png'),
    backgroundColor: '#ffa647',
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 34,
  },
  text: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
})

function renderSlide({ item }) {
  return (
    <View
      style={{
        backgroundColor: item.backgroundColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
      testID={item.key}
    >
      <View>
        <Image source={item.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  )
}

export default function AppIntro({ showIntro, onDone, children }) {
  if (showIntro) {
    return (
      <AppIntroSlider
        renderItem={renderSlide}
        slides={slides}
        onDone={onDone}
      />
    )
  }
  return children
}
