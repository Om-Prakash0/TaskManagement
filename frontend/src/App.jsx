
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [limit, setLimit] = useState('');
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('');

  const API = 'http://localhost:3000/tasks';

  // GET all tasks
  const getTasks = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setMessage('Cannot connect to the backend');
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // CREATE task
  const createTask = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setTaskName('');
      setLimit('');
      setStatus('pending');
      setMessage('Task created successfully');

      getTasks();
    } catch (error) {
      setMessage('Cannot connect to the backend');
    }
  };

  // DELETE task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API}/${taskId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage('Task deleted successfully');
      getTasks();
    } catch (error) {
      setMessage('Cannot connect to the backend');
    }
  };

  const pendingTasks = tasks.filter(
    task => task.status === 'pending'
  ).length;

  const completedTasks = tasks.filter(
    task => task.status === 'completed'
  ).length;

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
        <p>Organize your work, one task at a time.</p>
      </header>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <h2>{tasks.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <h2>{pendingTasks}</h2>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <h2>{completedTasks}</h2>
        </div>
      </div>

      <div className="content">
        <form onSubmit={createTask} className="task-form">
          <h2>Create New Task</h2>

          <label>Task Name</label>
          <input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            required
          />

          <label>Time Limit</label>
          <input
            type="text"
            placeholder="e.g. 2 hours"
            value={limit}
            onChange={e => setLimit(e.target.value)}
            required
          />

          <label>Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <button type="submit">Add Task</button>
        </form>

        <div className="task-list">
          <h2>My Tasks</h2>

          {message && <p className="message">{message}</p>}

          {tasks.length === 0 ? (
            <p>No tasks available. Create your first task!</p>
          ) : (
            tasks.map(task => (
              <div className="task-card" key={task.taskId}>
                <div>
                  <h3>{task.taskName}</h3>
                  <p>Time limit: {task.limit}</p>
                  <span className={`status ${task.status}`}>
                    {task.status}
                  </span>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.taskId)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
