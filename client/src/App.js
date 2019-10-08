import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import Octicon, { Check, Sync, KebabHorizontal } from '@primer/octicons-react'

class App extends Component {
  state = {
    todoItem: '',
    items: [],
    message: null
  };

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios.get('http://localhost:3001/api/todos')
      .then((res) => {
        this.setState({ items: res.data.data })
      })
  }

  createTodos(todoItem) {
    axios.post('http://localhost:3001/api/todos', { todoItem })
      .then(() => this.getTodos())
  };

  deleteTodos(id) {
    axios.delete(`http://localhost:3001/api/todos/${id}`)
      .then(() => this.getTodos())
  };

  updateTodos = (id, todoItem) => {
    axios.put(`http://localhost:3001/api/todos/${id}`, { todoItem })
      .then(() => {
        this.getTodos();
        Swal.fire({
          toast: true,
          title: 'Updated',
          showConfirmButton: false,
          type: 'success',
          timer: 3000,
          position: 'bottom-end'
        })
      })
  };

  render() {
    const { items } = this.state;
    return (
      <div>
        <header style={ { margin: '100px' } }>
          <div className="container h-100">
            <div className="row h-100 align-items-center">
              <div className="col-12 text-center">
                <h1>What do I have to do next?</h1>
                <div className='input-group w-50 mx-auto'>
                  <input
                    className="form-control"
                    type='text'
                    onChange={ (e) => this.setState({ todoItem: e.target.value }) }
                    placeholder='Type here...'
                  />
                  <div className="input-group-append">
                    <button type="button" className="btn btn-primary" onClick={ () => this.createTodos(this.state.todoItem) }>
                      Do it!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="d-flex flex-column align-items-center">
            <Octicon icon={ KebabHorizontal } />
          </div>
        </div>
        <div className="container">
          <div className="d-flex flex-column mt-5">
            { items.length <= 0
              ? 'Nothing to do'
              : items.map((dat, index) => (
                <div className='input-group w-50 mx-auto mt-2' key={ index }>
                  <input
                    className="form-control"
                    type="text"
                    value={ dat.todoItem }
                    onChange={ (e) => {
                      let updatedData = this.state.items;
                      updatedData[index].todoItem = e.target.value;
                      this.setState({ items: updatedData })
                    } }
                    placeholder="New to do"
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-secondary"
                      onClick={ () => this.updateTodos(dat._id, dat.todoItem) }>
                      <Octicon icon={ Sync } />
                    </button>
                  </div>
                  <div className="input-group-append">
                    <button
                      className="btn btn-success"
                      onClick={ () => this.deleteTodos(dat._id) }>
                      <Octicon icon={ Check } />
                    </button>
                  </div>
                </div>
              )) }
          </div>
        </div>
      </div>
    )
  }
}

export default App;
