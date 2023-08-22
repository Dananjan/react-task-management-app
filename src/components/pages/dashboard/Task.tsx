import React, { useState, useEffect } from 'react';
import { DocumentData } from 'firebase/firestore';
import EditTask from './EditTask';
import { auth } from '../../../firebase';
import { User } from 'firebase/auth';
import { fetchUserData } from '../../../services/userService';
import { addTask, readTask, deleteTask, updateCheck } from '../../../services/taskService';
import { FiTrash2 } from "react-icons/fi";
import './Dashboard.css';



interface TodoItem {
  id: string;
  todo: string;
  isChecked: boolean;
  timestamp: {
    seconds: number;
  };
}

const Task: React.FC = () => {
  const user: User | null = auth.currentUser;
  const [docId, setDocId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [createTodo, setCreateTodo] = useState("");
  const [todos, setTodo] = useState<TodoItem[]>([]);
  const [checked, setChecked] = useState<TodoItem[]>([]);
  const [showCompleted, setShowCompleted] = useState(true); 
  const [showUncompleted, setShowUncompleted] = useState(true); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const getUserData = async () => {
      const userData: DocumentData = await fetchUserData();
      setDocId(userData[0].docId);
    }
    getUserData();
    
  }, [])
  
  useEffect(() => {
    if (docId) {
      getTodo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId, showCompleted, showUncompleted, selectedDate]);

  const getTodo = async () => {
    if (user && user.uid){ 
      const todoSnapshot = await readTask(docId);
      try {
        if (todoSnapshot) {
          const todoData = todoSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as TodoItem[];        
        
        
          const filteredTodos = todoData.filter((todo) => {
            const timestampDate = new Date(todo.timestamp.seconds * 1000);
            const isCompleted = todo.isChecked;
      
            if ((isCompleted && !showCompleted) || (!isCompleted && !showUncompleted)) {
              return false;
            }
      
            if (selectedDate && timestampDate.toDateString() !== selectedDate.toDateString()) {
              return false;
            }
      
            return true;
          });
          
          setTodo(filteredTodos);
          setChecked(filteredTodos);
        }

      } catch (err) {
        console.log(err);
      }
    }
  }

  const updateTodoData = (updatedTodoData: TodoItem[]) => {
    setTodo(updatedTodoData);
    setChecked(updatedTodoData);
    console.log(checked);
  };

  const submitTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user&&user.uid){
      await addTask(docId,createTodo );
      setCreateTodo('');
      getTodo();
    }
  }


  const deleteTodo = async (id:string) => {
    await deleteTask(id,docId);
    getTodo();
  }

  const handleShowCompletedChange = () => {
    setShowCompleted(!showCompleted);
  };
  
  const handleShowUncompletedChange = () => {
    setShowUncompleted(!showUncompleted);
  };
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };



  const checkHandler = async (event: React.ChangeEvent<HTMLInputElement>, todo: string) => {
    setChecked((state) => {
      const indexToUpdate = state.findIndex((checkBox) => checkBox.id.toString() === event.target.name);
      let newState = state.slice();
      newState.splice(indexToUpdate, 1, {
        ...state[indexToUpdate],
        isChecked: !state[indexToUpdate].isChecked,
      });
      setTodo(newState);
      return newState;
    });

    await updateCheck(docId, event);
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <button type="button" className="add-btn btn btn-info " onClick={() => setShowModal(true)}>Add New Task</button>
            <div className="filter-section">
              <label className='filter-lbl'>
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={handleShowCompletedChange}
                  className='filter-input'
                />
                Show Completed
              </label>

              <label className='filter-lbl'>
                <input
                  type="checkbox"
                  checked={showUncompleted}
                  onChange={handleShowUncompletedChange}
                  className='filter-input'
                />
                Show Uncompleted
              </label>

              <label className='filter-lbl'>
                Select Date : <input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
                  onChange={(e) => handleDateChange(e.target.valueAsDate)}
                  className='filter-input'
                /> 
              </label>
            </div>
            <div className="card card-white">
              <div className="card-body">
                  {todos.map(({ todo, id, isChecked, timestamp }) =>
                    <div className="todo-list" key={id}>
                      <div className="todo-item">
                        
                        <span className={`${isChecked === true ? 'done' : ''} task-item`}>
                          
                          <div className='task'>&nbsp;{todo}</div>
                          <div className='item-time'>{new Date(timestamp.seconds * 1000).toLocaleString()}</div>
                          <div className='checker' >
                            <span className="" >
                              <input
                                type="checkbox"
                                defaultChecked={isChecked}
                                name={id}
                                onChange={(event) => checkHandler(event, todo)}
                              />
                            </span>
                          </div>
                        </span>                    
                        <span className="mx-3">
                          <EditTask todo={todo} docId={docId} id={id} updateTodoData={updateTodoData} />
                        </span>
                        <button
                          type="button"
                          className="btn btn-danger item-button"
                          onClick={() => deleteTodo(id)}
                        ><FiTrash2 /></button>
                      </div>  
                      <hr className='h-ruler' />
               
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal fade ${showModal ? 'show' : ''}`} id="addModal" tabIndex={-1} aria-labelledby="addModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <form className="d-flex frm-add" onSubmit={submitTodo}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">Add Task</h5>
                <button type="button" className="btn-close" onClick={() => {setShowModal(false);setCreateTodo('');}} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a Todo"
                  value={createTodo}
                  onChange={(e) => setCreateTodo(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type='submit' className="btn btn-primary">Create Task</button>
                <button type='button' className="btn btn-secondary" onClick={() => {setShowModal(false);setCreateTodo('');}}>Close</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Task;