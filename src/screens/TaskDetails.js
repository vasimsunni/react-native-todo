import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Input } from "react-native-elements/dist/input/Input";
import Button from 'react-native-button';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import Swipeout from 'react-native-swipeout';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';



export default function TaskDetails({ route, navigation }) {
    const { getItem, setItem } = useAsyncStorage('todo');
    const [currentItem, setCurrentItem] = useState(route.params.item);
    const [loading, setLoading] = useState(false);

    // alert(JSON.stringify(currentItem));


    function getTodo() {
        getItem()
            .then((todoJSON) => {
                const todo = todoJSON ? JSON.parse(todoJSON) : [];

                const extractIndex = todo.findIndex(e => e.id === currentItem.id);

                let currentTodo = todo[extractIndex];
                setCurrentItem(currentTodo);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: 'Failed while finding Todos.',
                    position: 'top', visibilityTime: 1000,
                });
            });
    }

    function SaveTodoItem(values) {
        if (!values.title) {
            Toast.show({
                type: 'error',
                text1: 'Missing',
                text2: 'Title is required',
                position: 'top', visibilityTime: 1000,
            });

            return;
        }

        getItem().then((todoJSON) => {
            let todo = todoJSON ? JSON.parse(todoJSON) : [];

            const extractIndex = todo.findIndex(e => e.id === currentItem.id);

            let currentTodo = todo[extractIndex];

            let currentTodoSubItem = currentTodo.items;

            if (currentTodoSubItem == null || currentTodoSubItem == undefined) {
                currentTodoSubItem = [];
            }

            currentTodoSubItem.push({
                id: uuid.v4(),
                title: values.title,
                checked: false
            });

            currentTodo.items = currentTodoSubItem;

            todo[extractIndex] = currentTodo;

            setItem(JSON.stringify(todo)).then(() => {
                setCurrentItem(currentTodo);

                values.title = '';
            }).catch((error) => {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: 'An error occurred and a new item could not be saved',
                    position: 'top', visibilityTime: 1000,
                });
            })
        }).catch((error) => {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: "Failed",
                text2: 'An error occurred and a new item could not be saved',
                position: 'top', visibilityTime: 1000,
            });
        })
    }

    function markSubTodoAsDoneUndone({ item }) {

        getItem()
            .then((todoJSON) => {
                const todo = todoJSON ? JSON.parse(todoJSON) : [];

                const extractIndex = todo.findIndex(e => e.id === currentItem.id);

                let currentTodo = todo[extractIndex];

                let currentTodoSubIndex = currentTodo.items.findIndex(c => c.id == item.id);

                currentTodo.items[currentTodoSubIndex].checked = item.checked ? false : true;

                if (item.checked) {
                    currentTodo.checked = false;
                }
                else {

                    var noOfUnchecked = currentTodo.items.filter(x => x.checked == false).length;

                    if (noOfUnchecked <= 0) {
                        currentTodo.checked = true;
                    }
                }

                todo[extractIndex] = currentTodo;

                setItem(JSON.stringify(todo)).then(() => {

                    setCurrentItem(currentTodo);

                    Toast.show({
                        type: 'success',
                        text1: item.checked ? 'Undone' : 'Done',
                        text2: item.title,
                        position: 'top', visibilityTime: 1000,
                    });

                }).catch((error) => {
                    console.error(error);
                    Toast.show({
                        type: 'error',
                        text1: 'Failed.',
                        text1: 'An error occurred.',
                        position: 'top', visibilityTime: 1000,
                    });
                });


            })
            .catch((err) => {
                console.error(err);
                Toast.show({
                    type: 'error',
                    text1: 'An error occurred',
                    position: 'top', visibilityTime: 1000,
                });
            });



    }

    function deleteSubTodo({ item }) {
        getItem()
            .then((todoJSON) => {
                const todo = todoJSON ? JSON.parse(todoJSON) : [];

                const extractIndex = todo.findIndex(e => e.id === currentItem.id);

                let currentTodo = todo[extractIndex];

                let currentTodoSubIndex = currentTodo.items.findIndex(c => c.id == item.id);

                currentTodo.items.splice(currentTodoSubIndex, 1);

                todo[extractIndex] = currentTodo;

                setItem(JSON.stringify(todo)).then(() => {

                    setCurrentItem(currentTodo);

                    Toast.show({
                        type: 'success',
                        text1: 'Deleted',
                        text2: item.title,
                        position: 'top', visibilityTime: 1000,
                    });

                }).catch((error) => {
                    console.error(error);
                    Toast.show({
                        type: 'error',
                        text1: 'Failed',
                        text2: 'An error occurred',
                        position: 'top', visibilityTime: 1000,
                    });
                });


            })
            .catch((err) => {
                console.error(err);
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: 'An error occurred',
                    position: 'top', visibilityTime: 1000,
                });
            });

    }



    function renderItem({ item }) {
        let swipeBtnsAll = [];

        if (!item.checked) {
            swipeBtnsAll.push(
                {
                    text: 'Done',
                    backgroundColor: '#4fdc6d',
                    underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                    borderRadius: 20,
                    hieght: 30,
                    onPress: () => { markSubTodoAsDoneUndone({ item }) }
                });
        }
        else {
            swipeBtnsAll.push(
                {
                    text: 'Undone',
                    backgroundColor: '#a3a1a1',
                    underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                    borderRadius: 20,
                    hieght: 30,
                    onPress: () => { markSubTodoAsDoneUndone({ item }) }
                });
        }


        swipeBtnsAll.push(
            {
                text: 'Delete',
                backgroundColor: '#dc4f4f',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                borderRadius: 20,
                hieght: 30,
                onPress: () => { deleteSubTodo({ item }) }
            }
        );

        return (
            <Swipeout right={swipeBtnsAll}
                autoClose={true}
                backgroundColor='rgba(0, 0, 0, 0)'>
                <View style={[styles.item, item.checked ? styles.itemDone : '']}>
                    <CheckBox style={styles.checkbox} checked={item.checked} checkedIcon='dot-circle-o' uncheckedIcon='circle-o' onPress={() => markSubTodoAsDoneUndone({ item })} />
                    <Text style={[styles.subTitle, item.checked ? styles.subTitleDone : '']} >{item.title}</Text>
                </View>
            </Swipeout>
        )
    }


    const TaskStatus = () => {
        const status = currentItem.checked ? 'Done' : 'Pending';

        return (
            <Text style={[styles.status, currentItem.checked ? styles.statusDone : styles.statusPending]}>{status}</Text>
        )

    }

    const TaskTitle = () => {
        return (
            <Text style={styles.title}>{currentItem.title}</Text>
        )
    }

    const SubTasks = () => {

        return (
            <View style={styles.subtask}>

                <FlatList refreshing={loading} onRefresh={getTodo} style={styles.list} data={currentItem.items}
                    renderItem={renderItem} keyExtractor={(item) => item.id} />
            </View>
        )
    }

    const AddSubTask = () => {
        return (
            <Formik initialValues={{ title: '' }} onSubmit={SaveTodoItem} style={styles.form}>
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View>
                        <Input
                            placeholder="Example: Exercise, Drink, Eat ect..."
                            onChangeText={handleChange('title')}
                            onBlur={handleBlur('title')}
                            style={styles.input}
                        />
                        <Button
                            style={{ fontSize: 20, color: '#ffffff' }}
                            containerStyle={{ padding: 10, height: 45, overflow: 'hidden', borderRadius: 4, backgroundColor: '#DC133B' }}
                            onPress={handleSubmit}>
                            Add
                        </Button>
                    </View>
                )}
            </Formik>
        )
    }



    return (
        <View style={styles.detailsPage}>
            <TaskStatus />
            <TaskTitle />
            <SubTasks />
            <AddSubTask />
        </View>
    )
}


const styles = StyleSheet.create({
    detailsPage: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    status: {

        padding: 3,
        borderRadius: 5,
        fontSize: 15,
        marginBottom: 8,
        alignSelf: 'flex-start'
    },
    statusDone: {
        backgroundColor: '#4fdc6d',
        color: '#fff',
    },
    statusPending: {
        backgroundColor: '#918a88',
        color: '#fff',
    },
    title: {
        fontSize: 20,
        color: '#DC133B',
        fontWeight: 'bold',
        textAlign: 'justify'
    },
    subTasks: {
        marginTop: 20,
        marginBottom: 20
    }, input: {
        marginTop: 10
    },
    form: {

        alignSelf: 'flex-end',
        borderTopWidth: 1,
        marginTop: 10
    },
    list: {
        width: '100%',
        marginTop: 20
    },
    cardTitle: {
        textAlign: 'left'
    },
    item: {
        padding: 0,
        paddingRight: 60,
        margin: 5,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,.03)',
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemDone: {
        // backgroundColor: 'rgba(0,0,0,.01)',
    },
    subTitle: {
        color: '#DC133B',
        fontSize: 18,
        padding: 2,
        textAlign: 'justify'
    },
    subTitleDone: {
        color: '#000000',
        fontSize: 18,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    checkbox: {
        display: 'flex',
    },
    subtask: {
        margin: 10,
        flex: 1
    }
})