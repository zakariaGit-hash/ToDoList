import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, TrashIcon, CheckIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [showCompleted, setShowCompleted] = useState(true);


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des todos:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/todos`, { 
        title: newTodo
      });
      setTodos([response.data, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du todo:', error);
    }
  };

  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCompleted = showCompleted || !todo.completed;
      return matchesSearch && matchesCompleted;
    })
    .sort((a, b) => {
      // Sort by date added (newest first)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Todo List</h1>
        <p className="text-center text-gray-600 mb-8">MADE BY BADAOUINI Zakaria et JR يي</p>
        
        <div className="bg-surface p-6 rounded-2xl shadow-card mb-8 animate-slide-up">
          <form onSubmit={addTodo} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Ajouter une nouvelle tâche"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-inner"
              />
              <button 
                type="submit" 
                className="bg-gradient-primary hover:opacity-90 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-card">
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </button>
            </div>
            

          </form>

          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-inner"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-colors duration-200 ${showCompleted ? 'bg-tertiary text-white border-tertiary' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                <CheckIcon className="h-5 w-5" />
                {showCompleted ? 'Masquer terminées' : 'Afficher terminées'}
              </button>
              
              <button
                onClick={fetchTodos}
                className="p-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                title="Rafraîchir"
              >
                <ArrowPathIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <ul className="space-y-3 mt-8">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucune tâche trouvée</div>
          ) : (
            filteredTodos.map(todo => {
              // Determine priority color
              let priorityColor = 'bg-gray-200';
              let priorityTextColor = 'text-gray-700';
              if (todo.priority === 'haute') {
                priorityColor = 'bg-orange-100';
                priorityTextColor = 'text-orange-800';
              } else if (todo.priority === 'urgente') {
                priorityColor = 'bg-red-100';
                priorityTextColor = 'text-red-800';
              } else if (todo.priority === 'basse') {
                priorityColor = 'bg-blue-100';
                priorityTextColor = 'text-blue-800';
              }
              
              return (
                <li 
                  key={todo.id} 
                  className={`bg-surface rounded-xl shadow-card p-5 flex items-center gap-4 animate-fade-in transform hover:scale-[1.02] transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`rounded-full p-1.5 ${todo.completed ? 'bg-gradient-primary text-white' : 'border-2 border-gray-300 hover:border-primary'}`}
                  >
                    {todo.completed && <CheckIcon className="h-5 w-5" />}
                  </button>
                  <div className="flex-1">
                    <span className={`block text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {todo.title}
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">

                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-secondary hover:bg-red-50 rounded-full p-2 transition-colors duration-200"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;