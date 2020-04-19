import * as React from 'react'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native'
import { SplashScreen } from 'expo'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import AppIntro from './components/AppIntro'
import BottomTabNavigator from './navigation/BottomTabNavigator'
import urlLinking from './navigation/urlLinking'

import GoalsCreateScreen from './screens/GoalsCreateScreen'
import GoalEditScreen from './screens/GoalEditScreen'

Sentry.init({
  dsn:
    'https://7c50611d993e4c39a0aa20b35138c74d@o373231.ingest.sentry.io/5205779',
  enableInExpoDevelopment: false,
  debug: true,
})

Sentry.setRelease(Constants.manifest.revisionId)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const [initialNavigationState, setInitialNavigationState] = React.useState()
  const [showIntro, setShowIntro] = React.useState(false)
  const containerRef = React.useRef()

  const { getInitialState } = urlLinking(containerRef)

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        setInitialNavigationState(await getInitialState())
        SplashScreen.preventAutoHide()
        const ranBefore =
          (await AsyncStorage.getItem('@ranBefore')) || props.skipIntro || false
        setShowIntro(!ranBefore)
      } catch (e) {
        Sentry.captureException(e)
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

  function slidesDone() {
    AsyncStorage.setItem('@ranBefore', 'true')
    setShowIntro(false)
  }

  return (
    <AppIntro showIntro={showIntro} onDone={slidesDone}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && (
          <StatusBar translucent barStyle="dark-content" />
        )}
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
            <Stack.Screen name="GoalEditScreen" component={GoalEditScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </AppIntro>
  )
}
