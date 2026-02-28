import { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";

export default function Clock() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // cleanup function
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0')
    const seconds = time.getSeconds().toString().padStart(2, '0');

    let clock = `${hours}:${minutes}:${seconds}`

    return (
        <View>
            <Text style={styles.clock}>
                {clock}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    clock: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 4,
    }
})