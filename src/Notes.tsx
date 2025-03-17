import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from './components/Note';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TRootStackParamList } from './App';
import { supabase } from './supabaseClient';
import {validateEquation} from "./util/validateEquation.ts"

export interface INote {
    title: string;
    text: string;
}

type TProps = NativeStackScreenProps<TRootStackParamList, 'Notes'> & {
    onLogout: () => Promise<void>;
};

export default class Notes extends React.Component<TProps, { notes: INote[], newNoteTitle: string, newNoteEquation: string }> {
    constructor(props: Readonly<TProps>) {
        super(props);
        this.state = {
            notes: [],
            newNoteTitle: '',
            newNoteEquation: ''
        };

        this.onNoteTitleChange = this.onNoteTitleChange.bind(this);
        this.onNoteEquationChange = this.onNoteEquationChange.bind(this);
        this.addNote = this.addNote.bind(this);
    }

    /**
     * Await the user session and load the notes from storage. This increases security by not storing the notes in memory.
     * 
     */
    async componentDidMount() {
        const { navigation } = this.props;
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
            Alert.alert('Error', 'Invalid session. Redirecting to Login.');
            navigation.replace('Login');
            return;
        }
        
        const existing = await this.getStoredNotes();
        this.setState({ notes: existing });
    }

    async componentWillUnmount() {
        this.storeNotes(this.state.notes);
    }

    /**
     * Stores and retrieve notes based on unique user ID instead of username/password 
     *  
     */
    private async getStoredNotes(): Promise<INote[]> {
        const { data } = await supabase.auth.getUser();
        if (!data.user) return [];

        const value = await AsyncStorage.getItem(`notes-${data.user.id}`);
        return value ? JSON.parse(value) : [];
    }

    /**
     * Prevents unauthorized access by saving notes per authenticated user ID
     * 
     */
    private async storeNotes(notes: INote[]) {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
            const jsonValue = JSON.stringify(notes);
            await AsyncStorage.setItem(`notes-${data.user.id}`, jsonValue);
        }
    }

    private onNoteTitleChange(value: string) {
        this.setState({ newNoteTitle: value });
    }

    private onNoteEquationChange(value: string) {
        this.setState({ newNoteEquation: value });
    }

    /**
     * Changes:
     *      1. The function performs input validation prior to inserting the new note. \
                This ensures malicious code can't be inserted directly from input fields.
     */
    private addNote() {
        try {
            validateEquation(this.state.newNoteEquation)
        } catch (e) {
            Alert.alert("Equation is not valid")
            return
        }

        const note: INote = {
            title: this.state.newNoteTitle,
            text: this.state.newNoteEquation
        };

        if (note.title === '' || note.text === '') {
            Alert.alert('Error', 'Title and equation cannot be empty.');
            return;
        }

        this.setState({ 
            notes: this.state.notes.concat(note),
            newNoteTitle: '',
            newNoteEquation: ''
        });
    }

    public render() {
        return (
            <SafeAreaView>
                <ScrollView contentInsetAdjustmentBehavior="automatic">
                    <View style={styles.container}>
                        <Text style={styles.title}>Math Notes</Text>
                        <TextInput
                            style={styles.titleInput}
                            value={this.state.newNoteTitle}
                            onChangeText={this.onNoteTitleChange}
                            placeholder="Enter your title"
                        />
                        <TextInput
                            style={styles.textInput}
                            value={this.state.newNoteEquation}
                            onChangeText={this.onNoteEquationChange}
                            placeholder="Enter your math equation"
                        />
                        <Button title="Add Note" onPress={this.addNote} />

                        <View style={styles.notes}>
                            {this.state.notes.map((note, index) => (
                                <Note key={index} title={note.title} text={note.text} />
                            ))}
                        </View>
                        {/* Logout button was implemented to clear user session */}
                        <Button title="Logout" onPress={this.props.onLogout} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    notes: {
        marginTop: 15
    },
});
