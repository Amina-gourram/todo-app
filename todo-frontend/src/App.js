import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [view, setView] = useState('list'); // 'list' ou 'form'
  const [editingTask, setEditingTask] = useState(null);

  
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error("Erreur de récupération des tâches :", error));
  }, []);

  
  const handleAddTask = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/tasks', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', status: 'pending' });
        setView('list'); // Retour à la liste après ajout
      })
      .catch(error => console.error("Erreur lors de l'ajout de la tâche :", error));
  };

 
  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error("Erreur lors de la suppression de la tâche :", error));
  };

 
  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description, status: task.status });
    setView('form');
  };

  
  const handleUpdateTask = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/tasks/${editingTask.id}`, newTask)
      .then(response => {
        setTasks(tasks.map(task => task.id === editingTask.id ? response.data : task));
        setEditingTask(null);
        setNewTask({ title: '', description: '', status: 'pending' });
        setView('list');
      })
      .catch(error => console.error("Erreur lors de la mise à jour de la tâche :", error));
  };

  
  const handleMarkAsCompleted = (id) => {
    axios.put(`http://localhost:5000/tasks/${id}`, { status: 'completed' })
      .then(response => {
        setTasks(tasks.map(task => task.id === id ? response.data : task));
      })
      .catch(error => console.error("Erreur lors du changement de statut de la tâche :", error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>liste des tâches</h1>
        <button onClick={() => setView(view === 'list' ? 'form' : 'list')}>
          {view === 'list' ? 'Ajouter une Tâche' : 'Voir les Tâches'}
        </button>
      </header>

      <main>
        {view === 'list' ? (
          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <button className="update" onClick={() => handleMarkAsCompleted(task.id)}>Marquer comme terminé</button>
                <button className="edit" onClick={() => handleEditTask(task)}>Modifier</button>
                <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
              </li>
            ))}
          </ul>
        ) : (
          <form onSubmit={editingTask ? handleUpdateTask : handleAddTask}>
            <input
              type="text"
              placeholder="Titre"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
            <button type="submit">{editingTask ? 'Mettre à jour' : 'Ajouter'}</button>
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
