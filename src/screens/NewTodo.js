import { Formik } from "formik";
import React from "react";
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import Button from 'react-native-button';
import { Input } from 'react-native-elements/dist/input/Input';
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';

export default function NewTodo({ navigation }) {

    const { getItem, setItem } = useAsyncStorage('todo');

    function saveTask(values) {
        if (!values.title) {
            Toast.show({
                type: 'error',
                text1: 'Title is required',
                position: 'top'
            });

            return;
        }

        getItem().then((todoJSON) => {
            let todo = todoJSON ? JSON.parse(todoJSON) : [];

            todo.push({
                id: uuid.v4(),
                title: values.title
            });

            setItem(JSON.stringify(todo)).then(() => {
                navigation.goBack();
            }).catch((error) => {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred and a new item could not be saved',
                    position: 'top'
                });
            })
        }).catch((error) => {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'An error occurred and a new item could not be saved',
                position: 'top'
            });
        })
    }

    return (
        <Formik initialValues={{ title: '' }} onSubmit={saveTask}>
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={style.container}>
                    <Text h4>New Todo Item</Text>
                    <Input
                        placeholder="Example: Exercise, Drink, Eat ect..."
                        onChangeText={handleChange('title')}
                        onBlur={handleBlur('title')}
                        style={style.input}
                        multiline={true}
                    />

                    <Button
                        style={{ fontSize: 20, color: '#ffffff' }}
                        containerStyle={{ padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: '#DC133B'}}
                        onPress={handleSubmit}>
                        Add
                    </Button>
                </View>
            )}
        </Formik>
    )
}

const style = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10
    },
    input: {
        marginTop: 10
    },
    button: {
        marginTop: 10,
        backgroundColor: '#f4a90a'
    }
})