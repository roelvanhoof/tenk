import * as React from 'react'
import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors'

export default function TabBarIcon(props) {
  const type = props.type || 'ionicon'
  return (
    <Icon
      name={props.name}
      type={type}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  )
}
