import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';
import Toast from 'react-native-toast-message';
import Swipeout from 'react-native-swipeout';
import ActionButton from 'react-native-action-button';

export default function HomeScreen({ navigation }) {
    const { getItem, setItem } = useAsyncStorage('todo');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    function getTodoList() {
        getItem()
            .then((todoJSON) => {
                const todo = todoJSON ? JSON.parse(todoJSON) : [];
                setItems(todo);
                setLoading(false);
            })
            .catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2: 'Failed while finding Todos.',
                    position: 'top', visibilityTime: 1000,
                });
            });
    }

    function markTodoAsDoneUndone({ item }) {

        if(item.items && item.items.length > 0){
            navigation.navigate("Details", { item: item });
            return;
        }


        getItem()
            .then((todoJSON) => {
                const todo = todoJSON ? JSON.parse(todoJSON) : [];

                const extractIndex = todo.findIndex(e => e.id === item.id);

                todo[extractIndex].checked = item.checked ? false : true;

                setItem(JSON.stringify(todo)).then(() => {

                    item = todo[extractIndex];

                    setItems(todo);

                    Toast.show({
                        type: 'success',
                        text1: item.checked ? 'Done' : 'Undone',
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

    function deleteTodo({ item }) {
        getItem()
            .then((todoJSON) => {
                const todo = todoJSON ? JSON.parse(todoJSON) : [];

                const extractIndex = todo.findIndex(e => e.id === item.id);

                todo[extractIndex].checked = true;

                todo.splice(extractIndex, 1);

                setItem(JSON.stringify(todo)).then(() => {

                    setItems(todo);

                    Toast.show({
                        type: 'success',
                        text1:'Deleted',
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
                    onPress: () => { markTodoAsDoneUndone({ item }) }
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
                    onPress: () => { markTodoAsDoneUndone({ item }) }
                });
        }


        swipeBtnsAll.push(
            {
                text: 'Delete',
                backgroundColor: '#dc4f4f',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                borderRadius: 20,
                hieght: 30,
                onPress: () => { deleteTodo({ item }) }
            }
        );

        let totalItemsCount = 0;
        let doneItemsCount = 0;

        if(item.items){
            totalItemsCount=item.items.length;
            doneItemsCount=item.items.filter(i=>i.checked).length;
        }

        let textCount='';

        if(totalItemsCount > 0){
            textCount= doneItemsCount + '/'+totalItemsCount;
        }

        return (
            <Swipeout right={swipeBtnsAll}
                autoClose={true}
                backgroundColor='rgba(0, 0, 0, 0)'>
                <View style={[styles.item, item.checked ? styles.itemDone : '']}>
                    <CheckBox style={styles.checkbox} checked={item.checked} checkedIcon='dot-circle-o' uncheckedIcon='circle-o' onPress={() => markTodoAsDoneUndone({ item })} />
                    <Text style={[styles.title, item.checked ? styles.titleDone : '']} onPress={() => navigation.navigate("Details", { item: item })} >{item.title}
                    <Text style={styles.taskCount} if>  {textCount}</Text>
                    </Text>
                    
                </View>
            </Swipeout>
        )
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getTodoList);

        return unsubscribe;
    }, [])

    return (
        <View style={styles.screen}>
            <FlatList refreshing={loading} onRefresh={getTodoList} style={styles.list} data={items}
                renderItem={renderItem} keyExtractor={(item) => item.id} />

            <ActionButton buttonColor="#dc133b" onPress={() => navigation.navigate("New")} />
        </View>
    )
}



const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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
        paddingRight: 5,
        margin: 10,
        marginTop:0,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,.03)',
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemDone: {
       // backgroundColor: 'rgba(220,19,59,0.02)',
    },
    title: {
        color: '#DC133B',
        fontSize: 20,
        padding: 2,
        textAlign:'justify',
        flex:1
    },
    titleDone: {
        color: '#000000',
        fontSize: 20,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    checkbox: {
        display: 'flex',

    },
    taskCount:{
        color:'#000000',
        fontSize:10,
        flex:1
    }
})