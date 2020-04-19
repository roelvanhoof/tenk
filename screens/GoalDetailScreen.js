import * as React from 'react'

import { View, Text, StyleSheet, AsyncStorage, FlatList } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useFocusEffect } from '@react-navigation/native'

import getGoalId from '../navigation/getGoalId'
import Tenk from '../lib/tenk'

const styles = StyleSheet.create({
  editButton: {
    color: 'rgb(0, 122, 255)',
    marginRight: 16,
    fontSize: 18,
  },
  container: {
    paddingTop: 22,
  },
  list: {
    marginBottom: 22,
  },
  listHeader: {
    textTransform: 'uppercase',
    marginLeft: 24,
    marginBottom: 8,
    fontSize: 12,
    color: '#919191',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd2d9',
  },
  key: {
    fontSize: 18,
    flexGrow: 1,
    marginLeft: 10,
  },
  value: {
    fontSize: 18,
    flexGrow: 1,
    textAlign: 'right',
    marginRight: 10,
    color: '#919191',
  },
})

function ListItem({ item }) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.key}>{item.key}</Text>
      <Text style={styles.value} testID={item.id}>
        {item.value}
      </Text>
    </View>
  )
}

function TimeListItem({ item, goal, navigation }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item.screen, { goal })
      }}
      testID={item.id}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.key}>{item.key}</Text>
        <Icon name="chevron-right" type="feather" />
      </View>
    </TouchableOpacity>
  )
}

export default function GoalDetailScreen({ navigation, route }) {
  const [goal, setGoal] = React.useState(null)

  function updateGoal(g) {
    setGoal(g)
    navigation.setOptions({
      headerTitle: g.name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GoalEditScreen', { goalId: g.id })
          }}
        >
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      ),
    })
  }

  function findGoal(goalsString) {
    const goals = JSON.parse(goalsString)
    goals.forEach(g => {
      const goalId = getGoalId(route)
      if (g.id === goalId) {
        updateGoal(g)
      }
    })
  }

  async function getData() {
    const goalsString = await AsyncStorage.getItem('@goals')
    findGoal(goalsString)
  }

  useFocusEffect(
    React.useCallback(() => {
      getData()
    }, [navigation])
  )

  function getGoalStats() {
    return [
      {
        id: 'hours',
        key: 'Hours required',
        value: goal.hours,
      },
      {
        id: 'spent',
        key: 'Time spent',
        value: Tenk.humanReadableHours(goal.spent),
      },
      {
        id: 'left',
        key: 'Time left',
        value: Tenk.humanReadableHours(goal.hours * 3600 - goal.spent),
      },
      {
        id: 'start',
        key: 'Date started',
        value: Tenk.humanReadableTimestamp(goal.startDate),
      },
      {
        id: 'master',
        key: 'Master',
        value: Tenk.calculateEndDate(goal),
      },
    ]
  }

  const timeActions = [
    {
      id: 'stopwatchButton',
      key: 'Stopwatch',
      screen: 'GoalStopwatch',
    },
    {
      id: 'timerButton',
      key: 'Timer',
      screen: 'GoalTimer',
    },
  ]

  if (goal == null) {
    return <Text testID="loading">Loading...</Text>
  }

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>Goal stats</Text>
      <FlatList
        style={styles.list}
        data={getGoalStats()}
        renderItem={({ item }) => <ListItem item={item} />}
      />
      <Text style={styles.listHeader}>Work on goal</Text>
      <FlatList
        style={styles.list}
        data={timeActions}
        renderItem={({ item }) => (
          <TimeListItem item={item} goal={goal} navigation={navigation} />
        )}
      />
    </View>
  )
}
