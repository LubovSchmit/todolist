import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType, TaskType} from './App';

type ToDoListPropsType = {
    todoListID: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    addTask: (title: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void  //либо тип того, что возвращает эта функция
    changeFilter: (value: FilterValuesType, todoListID: string) => void
    changeTaskStatus: (taskID: string, newIsDoneValue: boolean, todoListID: string) => void
    removeTodoList: (todoListID: string) => void
}

function ToDoList(props: ToDoListPropsType) {
    const filter = props.filter
    const [title, setTitle] = useState('')
    const [error, setError] = useState<boolean>(false)
    const tasksJSXElements = props.tasks.map(t => {
        const taskClasses: string = t.isDone ? 'is-done' : '';
        const removeTask = () => props.removeTask(t.id, props.todoListID)


        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked, props.todoListID)
        return (//условное присвоение класса:
            <li className={taskClasses}>
                 <input
                    onChange={changeTaskStatus}
                    type='checkbox'
                    checked={t.isDone}/>
                <span>{t.title}</span>
                <button onClick={removeTask}> x</button>
            </li>
        )
    })


    const onClickAddTask = () => {
        const trimmedTitle = title.trim() //обрезка пробелов слева и справа введенного текста
        if (trimmedTitle) {
            props.addTask(trimmedTitle, props.todoListID)  //невозможно теперь создать пустую таску
        } else {
            setError(true)
        }
        setTitle('')
    }

    const onKeyPressAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onClickAddTask()
        }
    }
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)  //error должен выскочить если пользователь
        //пытается ввести пустую строку
    }
    const onClickAllFilter = () => props.changeFilter('all', props.todoListID)
    const onClickActiveFilter = () => props.changeFilter('active', props.todoListID)
    const onClickCompletedFilter = () => props.changeFilter('completed', props.todoListID)
const onClickRemoveTodoList = ()=> props.removeTodoList(props.todoListID)
    const errorMessage = error
        ? <div className={'error-message'}>Title is required</div>
        : null
    //либо <div style = {{color: 'maroon'}}> -это не CSS, это инлайновая стилизация
    //  - особая запись стиля, кот нигде больше не будет использоваться
    // здесь стиль пишется через создание объекта, в кот
    // ключ это свойство, кот пишется верблюжьей записью (backgroundColor, a не background-color),
    // а значение всегда строка " "


    return (

        <div>
            <h3>{props.title}<button onClick={onClickRemoveTodoList}>x</button></h3>
            <div>
                <input className={error ? 'error' : ''}
                       value={title}
                    /*value={error ? 'Title is required' : title}*/ //сообщение выскочит будет в самом поле ввода
                    //можно так сделать сообщение при ошибке т.е. вводе пустой строки
                       onChange={onChangeTitle}
                       onKeyPress={onKeyPressAddTask}
                />
                <button onClick={onClickAddTask}>+</button>
                {errorMessage}
            </div>
            <ul>
                {tasksJSXElements}
            </ul>
            <div>
                <button
                    className={filter === 'all' ? 'active-filter' : ''}
                    onClick={onClickAllFilter}>
                    All
                </button>
                <button
                    className={filter === 'active' ? 'active-filter' : ''}
                    onClick={onClickActiveFilter}>
                    Active
                </button>
                <button
                    className={filter === 'completed' ? 'active-filter' : ''}
                    onClick={onClickCompletedFilter}>
                    Completed
                </button>
            </div>
        </div>
    )
}

export default ToDoList;