// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, ActivityIndicator, FlatList } from 'react-native';
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
        <View style={styles.workoutContainer}>
            <Text style={styles.workoutName}>{item.name}</Text>
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

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Workout Tracker</Text>
            <ScrollView>
                <WorkoutList />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    },
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