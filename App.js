import * as React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native'
import { SplashScreen } from 'expo'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AppIntroSlider from 'react-native-app-intro-slider'

import BottomTabNavigator from './navigation/BottomTabNavigator'
import useLinking from './navigation/useLinking'

import GoalsCreateScreen from './screens/GoalsCreateScreen'

const slides = [
  {
    key: 'screen1',
    title: '10 000 hours',
    text: 'It takes ~10 000 hours of practice\nto master a goal',
    image: require('./assets/images/intro/screen-1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'screen2',
    title: 'TenK',
    text: 'TenK helps you track your progress\ntowards your goals',
    image: require('./assets/images/intro/screen-2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'screen3',
    title: 'Goals',
    text: 'Add a goal you want to master',
    image: require('./assets/images/intro/screen-3.png'),
    backgroundColor: '#ff5b5b',
  },
  {
    key: 'screen4',
    title: 'Track your progress',
    text: 'Start the stopwatch (or timer) to\ntrack your progress',
    image: require('./assets/images/intro/screen-4.png'),
    backgroundColor: '#8496ff',
  },
  {
    key: 'screen5',
    title: 'Profit!',
    text: 'Become a master',
    image: require('./assets/images/intro/screen-5.png'),
    backgroundColor: '#ffa647',
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const [initialNavigationState, setInitialNavigationState] = React.useState()
  const [showIntro, setShowIntro] = React.useState(true)
  const containerRef = React.useRef()
  const { getInitialState } = useLinking(containerRef)

  function renderSlide({ item }) {
    return (
      <View
        style={{
          backgroundColor: item.backgroundColor,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <View>
          <Image source={item.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    )
  }

  function slidesDone() {
    setShowIntro(false)
  }

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        setInitialNavigationState(await getInitialState())
        SplashScreen.preventAutoHide()
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hide()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null
  }

  const Stack = createStackNavigator()

  if (showIntro) {
    return (
      <AppIntroSlider
        renderItem={renderSlide}
        slides={slides}
        onDone={slidesDone}
      />
    )
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <NavigationContainer
        ref={containerRef}
        initialState={initialNavigationState}
      >
        <Stack.Navigator mode="modal">
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="GoalsCreate" component={GoalsCreateScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}
