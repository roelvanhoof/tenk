import * as React from 'react'
import * as Yup from 'yup'

import {
  Platform,
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  AsyncStorage,
  Alert,
} from 'react-native'

import { Button, Input } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'

import { Formik, ErrorMessage } from 'formik'

import FormError from './FormError'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#ED5D68',
  },
  label: {
    color: 'rgb(134, 147, 158)',
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
  },
})

const GoalCreateSchema = Yup.object().shape({
  name: Yup.string()
    .max(30, 'Keep your goal name short!')
    .required('Name is required'),
  hours: Yup.number()
    .typeError('Hours must be a number')
    .min(1, '1 hour minimum goal')
    .max(10000, 'In 10.000 hours you will be a master already')
    .required('Hours is required'),
  spent: Yup.number()
    .max(
      Yup.ref('hours'),
      'Hours spent should not exceed the number of hours required'
    )
    .required('Required'),
  startDate: Yup.number()
    .required('Required')
    .positive(),
})

export default function GoalForm({
  onSubmit,
  navigation,
  action,
  goal = null,
}) {
  const [showDatePicker, setShowDatePicker] = React.useState(false)

  async function deleteGoal() {
    const goalsString = await AsyncStorage.getItem('@goals')
    const goals = JSON.parse(goalsString)
    const filteredGoals = goals.filter(g => {
      return g.id !== goal.id
    })
    await AsyncStorage.setItem('@goals', JSON.stringify(filteredGoals))
    navigation.navigate('GoalList')
  }

  function deleteGoalAlert() {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete the "${goal.name}" goal?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            return deleteGoal()
          },
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Formik
          initialValues={{
            name: goal ? goal.name : '',
            hours: goal ? goal.hours.toString() : '10000',
            spent: goal ? Math.floor(goal.spent / 3600).toString() : '0',
            startDate: goal ? goal.startDate * 1000 : Date.now(),
          }}
          validationSchema={GoalCreateSchema}
          onSubmit={values => {
            onSubmit(values, navigation)
          }}
        >
          {({
            values,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Input
                  label="Name of your goal"
                  placeholder="Learn Spanish, Guitarist"
                  value={values.name}
                  onChangeText={value => setFieldValue('name', value)}
                  onBlur={() => setFieldTouched('name')}
                  editable={!isSubmitting}
                  autoFocus
                  testID={`${action}name`}
                  returnKeyType="next"
                />
                <ErrorMessage
                  name="name"
                  component={FormError}
                  testID={`${action}nameError`}
                />
              </View>
              <View style={styles.inputContainer}>
                <Input
                  label="Hours required to reach goal"
                  value={values.hours}
                  onChangeText={value => setFieldValue('hours', value)}
                  onBlur={() => setFieldTouched('hours')}
                  editable={!isSubmitting}
                  keyboardType="number-pad"
                  testID={`${action}hours`}
                  returnKeyType="next"
                />
                <ErrorMessage
                  name="hours"
                  component={FormError}
                  testID={`${action}hoursError`}
                />
              </View>
              <View style={styles.inputContainer}>
                <Input
                  label="Hours already spent on goal"
                  value={values.spent}
                  onChangeText={value => setFieldValue('spent', value)}
                  onBlur={() => setFieldTouched('spent')}
                  editable={!isSubmitting}
                  keyboardType="number-pad"
                  testID={`${action}spent`}
                  returnKeyType="done"
                />
                <ErrorMessage
                  name="spent"
                  component={FormError}
                  testID={`${action}spentError`}
                />
              </View>
              {parseInt(values.spent, 10) > 0 && (
                <Text style={styles.label}>Start date of goal</Text>
              )}
              {Platform.OS === 'android' && parseInt(values.spent, 10) > 0 && (
                <Button
                  onPress={() => setShowDatePicker(true)}
                  title="Set start date"
                  style={styles.button}
                  testID={`${action}androidStartDateButton`}
                />
              )}
              <ErrorMessage
                name="startDate"
                component={FormError}
                testID={`${action}startDateError`}
              />
              {((Platform.OS === 'ios' && parseInt(values.spent, 10) > 0) ||
                showDatePicker) && (
                <DateTimePicker
                  testID={`${action}dateTimePicker`}
                  timeZoneOffsetInMinutes={0}
                  value={new Date(values.startDate)}
                  mode="date"
                  is24Hour
                  display="default"
                  onChange={(_event, date) =>
                    setFieldValue('startDate', date.getTime())
                  }
                />
              )}
              <Button
                title={action === 'edit' ? 'Edit Goal' : 'Add Goal'}
                onPress={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
                loadingProps={{ size: 'large', color: 'white' }}
                style={styles.button}
                testID={`${action}goalFormSubmitButton`}
              />
              {action === 'edit' && (
                <Button
                  title="Delete Goal"
                  onPress={deleteGoalAlert}
                  buttonStyle={styles.deleteButton}
                  testID="deleteGoalButton"
                />
              )}
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
