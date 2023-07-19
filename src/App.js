import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/bootstrap.css';
import './css/main.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get('/api/todos')
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error('Hiba történt a ToDo lista lekérdezésekor:', error);
      });
  };

  const handleNewTodoChange = event => {
    setNewTodoTitle(event.target.value);
  };

  const handleNewTodoSubmit = event => {
    event.preventDefault();

   axios
      .post('/api/todos', { title: newTodoTitle })
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodoTitle('');
      })
      .catch(error => {
        console.error('Hiba történt az új ToDo létrehozásakor:', error);
      });
  };

  const handleTodoEdit = todo => {
    setSelectedTodo({...todo});
  };

  const handleTodoUpdate = () => {
      axios
      .put(`/api/todos/${selectedTodo._id}`, {
        title: selectedTodo.title,
        completed: selectedTodo.completed
      })
      .then(response => {
        setSelectedTodo(null);
        fetchTodos();
      })
      .catch(error => {
        console.error('Hiba történt a ToDo frissítésekor:', error);
      });
  };

  const handleTodoDelete = todo => {
   axios
    .delete(`/api/todos/${todo._id}`)
    .then(response => {
      fetchTodos();
    })
    .catch(error => {
      console.error('Hiba történt a ToDo törlésekor:', error);
    });
  };

  const handleTodoCancel = () => {
    setSelectedTodo(null);
  };

  return (
    <section className="todo-app">
      <div className="container todo-cont">
        <h1 className="text-center mb-4">ToDo alkalmazás</h1>
        <form className="d-flex mb-3" onSubmit={handleNewTodoSubmit}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Írd be teendődet..."
            value={newTodoTitle}
            onChange={handleNewTodoChange}
          />
          <button className="btn btn-primary" type="submit">
            Hozzáadás
          </button>
        </form>
        <ul className="list-group">
          {todos.map(todo => (
            <li className="list-group-item d-flex justify-content-between align-items-center mb-2" key={todo._id}>
              {selectedTodo && selectedTodo._id === todo._id ? (
                <>
                  <input
                    type="text"
                    className="form-control me-2"
                    style={{width: '70%'}}
                    value={selectedTodo.title}
                    onChange={event =>
                      setSelectedTodo({
                        ...selectedTodo,
                        title: event.target.value
                      })
                    }
                  />
                  <div>
                    <button className="btn btn-success me-2" onClick={handleTodoUpdate}>
                      Mentés
                    </button>
                    <button className="btn btn-secondary" onClick={handleTodoCancel}>
                      Mégse
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{todo.title}</span>
                  <div>
                    <button className="btn btn-primary me-2" onClick={() => handleTodoEdit(todo)}>
                      Szerkesztés
                    </button>
                    <button className="btn btn-danger" onClick={() => handleTodoDelete(todo)}>
                      Törlés
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default App;
