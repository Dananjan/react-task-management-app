import React, { useState } from 'react';
import { updateTask } from '../../../services/taskService';
import { FiEdit3 } from "react-icons/fi";
import './Dashboard.css';

interface EditTodoProps {
  todo: string;
  docId:string;
  id: string;
  updateTodoData: (updatedTodoData: any) => void; 
}


const EditTask: React.FC<EditTodoProps> = ({ todo, docId, id, updateTodoData }) => {
  const [todos, setTodos] = useState<string[]>([todo]);
  const [showModal, setShowModal] = useState(false);
  const updateTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateTask(id, docId, todos);
      
      updateTodoData((prevTodoData: any) =>
        prevTodoData.map((item: any) =>
          item.id === id ? { ...item, todo: todos } : item
        )
      );

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <button type="button" className="btn btn-primary item-button" onClick={() => setShowModal(true)}><FiEdit3 /></button>

      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        id={`id${id}`}
        tabIndex={-1}
        aria-labelledby="editLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog ">
          <div className="modal-content frm-edit">
            <div className="modal-header">
              <h5 className="modal-title" id="editLabel">
                Update Task Details
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <form className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  defaultValue={todo}
                  onChange={(e) => setTodos([e.target.value])}
                />
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={updateTodo}>
                Update Todo
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditTask;