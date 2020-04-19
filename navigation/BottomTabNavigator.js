import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import TabBarIcon from '../components/TabBarIcon'

import AboutScreen from '../screens/AboutScreen'

import GoalsScreen from '../screens/GoalsScreen'
import GoalDetailScreen from '../screens/GoalDetailScreen'
import GoalStopwatchScreen from '../screens/GoalStopwatchScreen'
import GoalTimerScreen from '../screens/GoalTimerScreen'

const BottomTab = createBottomTabNavigator()
const INITIAL_ROUTE_NAME = 'Goals'

const GoalsStack = createStackNavigator()

const GoalsStackNavigator = () => (
  <GoalsStack.Navigator>
    <GoalsStack.Screen name="GoalList" component={GoalsScreen} />
    <GoalsStack.Screen name="GoalDetails" component={GoalDetailScreen} />
    <GoalsStack.Screen name="GoalStopwatch" component={GoalStopwatchScreen} />
    <GoalsStack.Screen name="GoalTimer" component={GoalTimerScreen} />
  </GoalsStack.Navigator>
)

const AboutStack = createStackNavigator()

const AboutStackNavigator = () => (
  <AboutStack.Navigator>
    <AboutStack.Screen name="About" component={AboutScreen} />
  </AboutStack.Navigator>
)

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Goals"
        component={GoalsStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} type="feather" name="target" />
          ),
          tabBarTestID: 'goalsBottomBarIcon',
        }}
      />
      <BottomTab.Screen
        name="About"
        component={AboutStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-book" />
          ),
          tabBarTestID: 'aboutBottomBarIcon',
        }}
      />
    </BottomTab.Navigator>
  )
}
