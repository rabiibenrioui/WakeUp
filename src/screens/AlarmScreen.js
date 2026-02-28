import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AlarmScreen({ navigation, route }) {

    // SelectedTime holds the time picked by the user
    const [selectedTime, setSelectedTime] = useState(new Date());

    // Control the visibility of the time picker
    const [show, setShow] = useState(true);

    // Format hours and minutes as 2-digit strings
    const hours = selectedTime.getHours().toString().padStart(2, '0');
    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
    
    // Declaring a time variable that combines the hours and minutes variables
    const time = `${hours}:${minutes}`;

    const saveAlarm = async () => {
        try {
            // Loads saved alarms so we can add to them
            const saved = await AsyncStorage.getItem('alarms');

            // If no alarms exist yet, default to empty array
            const alarms = saved ? JSON.parse(saved) : [];

            // Build the new alarm object
            const newAlarm = {
                id: Date.now().toString(),
                time: time,
                enabled: true,
            };

            // Push the new Alarm object to the alarms array
            alarms.push(newAlarm);

            // Save the updated array back to AsyncStorage
            await AsyncStorage.setItem('alarms', JSON.stringify(alarms));

            // Calling the onGoBack callback we received from HomeScreen
            route.params?.onGoBack?.();

            // Pop this screen off the stack and return to HomeScreen
            navigation.goBack();
        }
        catch(e) {
            console.log('Error saving alarm: ', e)
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>{time}</Text>
            <Text style={styles.warning}>No snooze. No mercy.</Text>

            {show && (

                <DateTimePicker 
                    value={selectedTime}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={(event, time) => {
                        // Time can be undefined if the user dismisses on Android, so we need to check first
                        if (time) setSelectedTime(time);
                    }}
                    style={styles.picker}
                    textColor="#ffffff"
                />
            )}
            {/* Save the alarm and go back */}
            <TouchableOpacity style={styles.saveButton} onPress={saveAlarm}>
                <Text style={styles.saveText}>Set Alarm</Text>
            </TouchableOpacity>

            {/* Cancel and go back, without saving */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center', // Centers everything vertically (like align-items: center on the cross axis in web flexbox, but here the main axis IS vertical since flexDirection defaults to 'column')
    paddingHorizontal: 24,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warning: {
    color: '#555',
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 40,
  },
  picker: {
    width: '100%',
    backgroundColor: '#0a0a0a', // Match screen background so it blends in
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 50,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16, // Extra tap area around the text (good mobile UX — small touch targets are frustrating)
  },
  cancelText: {
    color: '#555',
    fontSize: 14,
  },
});