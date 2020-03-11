import * as React from 'react'
import { StyleSheet, View, Text, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

import GoalList from '../components/GoalList'
import AddGoalHeaderButton from '../components/AddGoalHeaderButton'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  introContainer: {
    marginTop: 66,
  },
  intro: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    marginTop: 30,
    marginLeft: 80,
    marginRight: 80,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    right: 16,
  },
})

function intro(goals, navigation) {
  if (goals && goals.length > 0) {
    return null
  }
  return (
    <View style={styles.introContainer}>
      <Text style={styles.intro}>You haven&apos;t added any goals yet.</Text>
      <Text style={styles.intro}>Go on and add your first goal!</Text>
      <Button
        onPress={() => navigation.navigate('GoalsCreate')}
        title="Add Goal"
        style={styles.button}
      />
    </View>
  )
}

export default function GoalsScreen({ navigation }) {
  const [goals, setGoals] = React.useState([])

  navigation.setOptions({
    headerTitle: 'Goals',
    headerRight: () => <AddGoalHeaderButton navigation={navigation} />,
  })

  React.useEffect(() => {
    const updateList = navigation.addListener('focus', () => {
      AsyncStorage.getItem('@goals').then(goalsString =>
        setGoals(JSON.parse(goalsString))
      )
    })
    return updateList
  }, [navigation])

  return (
    <View style={styles.container}>
      {intro(goals, navigation)}
      <GoalList items={goals} navigation={navigation} />
    </View>
  )
}
