import React, {useState} from 'react';
import './App.css';
import ToDoList from './ToDoList';
import {v1} from 'uuid';


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type FilterValuesType = 'all' | 'active' | 'completed'
type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
type TaskStateType = {
    [key: string]: Array<TaskType>
}

export function App() {
//BLL:
    const todoListID_1 = v1()
    const todoListID_2 = v1()

    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListID_1, title: 'What to learn', filter: 'all'},
        {id: todoListID_2, title: 'What to buy', filter: 'all'},
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListID_1]: /*это вычисляемое свойство объекта, это не массив! */ [
            {id: v1(), title: 'HTML', isDone: true},
            {id: v1(), title: 'CSS', isDone: true},
            {id: v1(), title: 'React', isDone: false},
        ],
        [todoListID_2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Bread', isDone: true},
            {id: v1(), title: 'Meat', isDone: false},
        ]
    })


    /*const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')*/

    function removeTask(taskID: string, todoListID: string) {
        tasks[todoListID] = tasks[todoListID].filter(t => t.id !== taskID)
        setTasks({...tasks})
        //или
        // setTasks({...tasks, [todoListID] = tasks[todoListID].filter(t => t.id !== taskID)})
    }

    function addTask(title: string, todoListID: string) {
        const newTask: TaskType = {
            id: v1(),
            title, //можно писать так если title: title
            isDone: false //по умолчанию false
        }
        setTasks({...tasks, [todoListID]: [newTask, ...tasks[todoListID]]})
        //создаем новый массив с его внутренним новым номером и эта
        // новая таска как и старые таски из старого массива будут заново отрисованы
    }

    function changeTaskStatus(taskID: string, newIsDoneValue: boolean, todoListID: string) {
        /*tasks[todoListID] = tasks[todoListID].map
        (t => t.id === taskID ? {...t, isDone: newIsDoneValue} : t))*/
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].map(t => t.id === taskID ? {...t, isDone: newIsDoneValue} : t)
        })
    }

    function changeFilter(value: FilterValuesType, todoListID: string) {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter: value} : tl))
    }

    function removeTodoList(todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
    }

    //UI:
    function getTasksForToDoList(todoList: TodoListType) {
        switch (todoList.filter) {
            case 'active':
                return tasks[todoList.id].filter(t => !t.isDone)
            case 'completed':
                return tasks[todoList.id].filter(t => t.isDone)
            default:
                return tasks[todoList.id]
        }
    }

    const todoListsComponents = todoLists.map(tl => {
            return (
                <ToDoList
                    key={tl.id}
                    todoListID={tl.id}
                    title={tl.title}
                    tasks={getTasksForToDoList(tl)}//результат функции
                    filter={tl.filter}
                    addTask={addTask}
                    removeTask={removeTask}//call-back функция
                    changeFilter={changeFilter}//call-back функция
                    changeTaskStatus={changeTaskStatus}
                    removeTodoList={removeTodoList}
                />
            )
        }
    )
    return (
        //JSX:
        <div className='App'>
            {todoListsComponents}
        </div>
    );
}
