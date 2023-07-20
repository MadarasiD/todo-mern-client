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
      .get('https://todo-app-api-aya2.onrender.com/api/todos')
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
      .post('https://todo-app-api-aya2.onrender.com/api/todos', { title: newTodoTitle })
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodoTitle('');
      })
      .catch(error => {
        console.error('Hiba történt az új ToDo létrehozásakor:', error);
      });
  };

  const handleTodoEdit = todo => {
    setSelectedTodo({ ...todo });
  };

  const handleTodoUpdate = () => {
    axios
      .put(`https://todo-app-api-aya2.onrender.com/api/todos/${selectedTodo._id}`, {
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
      .delete(`https://todo-app-api-aya2.onrender.com/api/todos/${todo._id}`)
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
        <div className="row">
          {todos.map(todo => (
            <div className="col-lg-4" key={todo._id}>
              <div className="card mb-4">
                <div className="card-body">
                  {selectedTodo && selectedTodo._id === todo._id ? (
                    <>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={selectedTodo.title}
                        onChange={event =>
                          setSelectedTodo({
                            ...selectedTodo,
                            title: event.target.value
                          })
                        }
                      />
                      <div className="text-end">
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
                      <h5 className="card-title mb-3">{todo.title}</h5>
                      <div className="text-end">
                        <button className="btn btn-primary me-2" onClick={() => handleTodoEdit(todo)}>
                          Szerkesztés
                        </button>
                        <button className="btn btn-danger" onClick={() => handleTodoDelete(todo)}>
                          Törlés
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default App;
