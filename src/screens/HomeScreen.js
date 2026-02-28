import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Clock from '../components/Clock';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {

    const [alarms, setAlarms] = useState([]);

    useEffect(() => {
        loadAlarms();
    }, [])

    const loadAlarms = async () => {
        try {
            const saved = await AsyncStorage.getItem('alarms');

            if(saved) setAlarms(JSON.parse(saved));
        }
        catch (e) {
            console.log('Error loading alarms: ', e);
        }
    };

    const toggleAlarm = async (id) => {
        const updated = alarms.map(alarm =>
            alarm.id === id ? {...alarm, enabled: !alarm.enabled} : alarm
        );

        // updating the UI immediately
        setAlarms(updated);

        await AsyncStorage.setItem('alarms', JSON.stringify(updated));
    };

    const deleteAlarm = async (id) => {
        const updated = alarms.filter(alarm => alarm.id !== id);
        setAlarms(updated);
        await AsyncStorage.setItem('alarms', JSON.stringify(updated));
    };

    return (
        <SafeAreaView style={styles.container}>

            <Clock />

            <Text style={styles.subtitle}>Wake Up. No Excuses.</Text>

            <FlatList 
                data={alarms}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.alarmRow}>

                        <Text style={styles.alarmTime}>{item.time}</Text>

                        <TouchableOpacity onPress={() => toggleAlarm(item.id)}>
                            <Text style={[styles.toggle, item.enabled && styles.toggleOn]}>
                                {item.enabled ? 'ON' : 'OFF'}
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => deleteAlarm(item.id)}>
                            <Text style={styles.delete}>X</Text>
                        </TouchableOpacity>

                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No alarms set. Add one below.</Text>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Alarm', { onGoBack: loadAlarms })}
            >
                <Text style={styles.addButtonText}>+ Add Alarm</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,              // Takes up the full screen height (like height: 100vh in CSS)
    backgroundColor: '#0a0a0a',
    alignItems: 'center', // Centers children horizontally (React Native is flexbox by default)
    justifyContent: 'center',
    paddingTop: 80,     // Pushes content down from the top (away from the status bar)
    textAlign: 'center',
    paddingHorizontal: 24,// Left and right padding (shorthand like padding: 0 24px in CSS)
  },
  subtitle: {
    color: '#ec993a',
    fontSize: 16,
    letterSpacing: 2,
    marginTop: 8,
    marginBottom: 40,
    textTransform: 'uppercase', // Same as CSS text-transform: uppercase
  },
  alarmRow: {
    flexDirection: 'row',       // Lay children left-to-right (default in RN is column, unlike web CSS)
    alignItems: 'center',
    justifyContent: 'flex-end', // Push children to opposite ends (like CSS space-between)
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  alarmTime: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    marginRight: 'auto',
  },
  toggle: {
    color: '#747474',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: 25,
  },
  toggleOn: {
    color: '#4CAF50', // Green when alarm is active
  },
  delete: {
    color: '#ff4444',
    fontSize: 22,
    fontWeight: 900,
  },
  empty: {
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#1877F2',
    paddingVertical: 16,   // Top and bottom padding only (like padding: 16px 0 in CSS)
    paddingHorizontal: 48, // Left and right padding only
    borderRadius: 50,      // Very high value = fully rounded pill shape
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});