import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import {validateEquation} from '../util/validateEquation'

interface IProps {
	title: string;
	text: string;
}

function Note(props: IProps) {
    /**
     * Changes:
     *      1. The function validates equations to make sure malicious code doesn't get passed to eval().
     *      2. The evaluation is wrapped in try-catch to make sure the app doesn't crash if the equation is invalid.
     */
	function evaluateEquation() {
        try {
            validateEquation(props.text)

            const result = eval(props.text);

            Alert.alert('Result', 'Result: ' + result);
        } catch {
            Alert.alert('Equation could not be evaluated');
        }
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{props.title}
			</Text>
			<Text style={styles.text}>
				{props.text}
			</Text>

			<View style={styles.evaluateContainer}>
				<Button title='Evaluate' onPress={evaluateEquation} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		marginTop: 5,
		marginBottom: 5,
		backgroundColor: '#fff',
		borderRadius: 5,
		borderColor: 'black',
		borderWidth: 1
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	text: {
		fontSize: 16,
	},
	evaluateContainer: {
		marginTop: 10,
		marginBottom: 10
	}
});

export default Note;