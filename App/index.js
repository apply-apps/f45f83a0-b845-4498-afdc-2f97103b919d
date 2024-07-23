// Filename: index.js
// Combined code from all files
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, FlatList, ActivityIndicator, TextInput, Button } from 'react-native';
import axios from 'axios';

const WorkoutList = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        const API_URL = 'http://apihub.p.appply.xyz:3300/chatgpt';
        try {
            const response = await axios.post(API_URL, {
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please provide answers for given requests." },
                    { role: "user", content: "List some workout plans with details including duration, intensity, and exercises involved." }
                ],
                model: "gpt-4o"
            });
            
            const { data } = response;
            const resultString = data.response;
            const workoutData = JSON.parse(resultString); // assuming the API returns a JSON-parsable string

            setWorkouts(workoutData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={workoutStyles.workoutContainer}>
            <Text style={workoutStyles.workoutName}>{item.name}</Text>
            <Text>Duration: {item.duration} mins</Text>
            <Text>Intensity: {item.intensity}</Text>
            <Text>Exercises:</Text>
            <FlatList
                data={item.exercises}
                renderItem={({ item }) => <Text>- {item}</Text>}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <FlatList
            data={workouts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
}

const workoutStyles = StyleSheet.create({
    workoutContainer: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const HeartRateTracker = () => {
    const [heartRate, setHeartRate] = useState('');
    const [heartRateRecords, setHeartRateRecords] = useState([]);

    const handleAddHeartRate = () => {
        if (heartRate) {
            setHeartRateRecords([...heartRateRecords, { id: heartRateRecords.length.toString(), value: heartRate }]);
            setHeartRate('');
        }
    };

    return (
        <View style={heartRateStyles.container}>
            <Text style={heartRateStyles.title}>Heart Rate Tracker</Text>
            <TextInput
                style={heartRateStyles.input}
                placeholder="Enter heart rate"
                keyboardType="numeric"
                value={heartRate}
                onChangeText={setHeartRate}
            />
            <Button title="Add" onPress={handleAddHeartRate} />
            <FlatList
                data={heartRateRecords}
                renderItem={({ item }) => <Text style={heartRateStyles.record}>{item.value} bpm</Text>}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const heartRateStyles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    record: {
        fontSize: 16,
        padding: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});

export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Workout Tracker</Text>
            <ScrollView>
                <WorkoutList />
                <HeartRateTracker />
            </ScrollView>
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});