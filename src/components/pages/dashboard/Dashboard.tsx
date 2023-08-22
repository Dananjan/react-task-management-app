import React from "react"
import Task from "./Task";
import './Dashboard.css';

const Dashboard: React.FC = () => {

  return(
    <div >
      <h2 className='main-title'>Dashboard</h2>
      <hr className='divider'/>
      <Task />
    </div>
  )
}

export default Dashboard;
  
