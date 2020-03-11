import * as React from 'react'
import * as Yup from 'yup'

import {
  Platform,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  AsyncStorage,
} from 'react-native'

import { Button, Input } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'

import { Formik } from 'formik'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    marginTop: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginLeft: 10,
    marginRight: 10,
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
    .required('Required'),
  hours: Yup.number()
    .min(1, '1 hour minimum goal')
    .max(10000, 'In 10.000 hours you will be a master already')
    .required('Required'),
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

async function addGoal(formValues, navigation) {
  try {
    const goalsString = (await AsyncStorage.getItem('@goals')) || '[]'
    const goals = JSON.parse(goalsString)
    const goal = {
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      name: formValues.name,
      hours: parseInt(formValues.hours, 10),
      startDate: parseInt(formValues.startDate, 10) / 1000,
      spent: parseInt(formValues.spent, 10) * 3600,
    }
    goals.push(goal)
    await AsyncStorage.setItem('@goals', JSON.stringify(goals))
    navigation.goBack()
  } catch (e) {
    // console.error(e)
  }
}

export default function GoalsCreateScreen({ navigation }) {
  const [showDatePicker, setShowDatePicker] = React.useState(false)

  navigation.setOptions({
    headerTitle: 'New Goal',
    headerBackTitle: 'Cancel',
  })

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Formik
        initialValues={{
          name: '',
          hours: '10000',
          spent: '0',
          startDate: Date.now(),
        }}
        validationSchema={GoalCreateSchema}
        onSubmit={values => {
          addGoal(values, navigation)
        }}
      >
        {({
          values,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
          setFieldTouched,
          isSubmitting,
        }) => (
          <View style={styles.form}>
            <Input
              label="Name of your goal"
              placeholder="Learn Spanish, Guitarist"
              value={values.name}
              onChangeText={value => setFieldValue('name', value)}
              onBlur={() => setFieldTouched('name')}
              editable={!isSubmitting}
              errorMessage={
                touched.name && errors.name ? errors.name : undefined
              }
              containerStyle={styles.input}
              autoFocus
            />
            <Input
              label="Hours required to reach goal"
              value={values.hours}
              onChangeText={value => setFieldValue('hours', value)}
              onBlur={() => setFieldTouched('hours')}
              editable={!isSubmitting}
              errorMessage={
                touched.hours && errors.hours ? errors.hours : undefined
              }
              containerStyle={styles.input}
              keyboardType="number-pad"
            />
            <Input
              label="Hours already spent on goal"
              value={values.spent}
              onChangeText={value => setFieldValue('spent', value)}
              onBlur={() => setFieldTouched('spent')}
              editable={!isSubmitting}
              errorMessage={
                touched.spent && errors.spent ? errors.spent : undefined
              }
              containerStyle={styles.input}
              keyboardType="number-pad"
            />
            {parseInt(values.spent, 10) > 0 && (
              <Text style={styles.label}>Start date of goal</Text>
            )}
            {Platform.OS === 'android' && parseInt(values.spent, 10) > 0 && (
              <Button
                onPress={() => setShowDatePicker(true)}
                title="Set start date"
                style={styles.button}
              />
            )}
            {errors.startDate && touched.startDate ? (
              <Text>{errors.startDate}</Text>
            ) : null}
            {((Platform.OS === 'ios' && parseInt(values.spent, 10) > 0) ||
              showDatePicker) && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={new Date(values.startDate)}
                mode="date"
                is24Hour
                display="default"
                onChange={value =>
                  setFieldValue('startDate', value.nativeEvent.timestamp)
                }
              />
            )}
            <Button
              title="Add Goal"
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingProps={{ size: 'large', color: 'white' }}
              style={styles.button}
            />
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  )
}
