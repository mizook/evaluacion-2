import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const url = 'http://20.231.202.18:8000/api/form'

  const [newUserModal, setNewUserModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);

  const [error, setError] = useState(null);
  const [alert, setAlert] = useState('');

  const [userList, setUserList] = useState([]);
  

  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEditCode = async (event) => {
    setEditCode(event.target.value);
  };
  const handleEditName = async (event) => {
    setEditName(event.target.value);
  };
  const handleEditDescription = async (event) => {
    setEditDescription(event.target.value);
  };


  const fetchUserList = async (filterText) => {
    try {
      const response = await axios.get(url);
      const data = response.data;

      const filteredList = data.filter(user => {
        return user.name.includes(filterText) || user.code.includes(filterText) || user.description.includes(filterText);
      });
  
      const userList = await Promise.all(
        filteredList.map(async (user) => {
          const { id, code, name, description } = user;
          return { id, code, name, description };
        })
      );
  
      setUserList(userList);
    } catch (error) {
      console.log(error);
      setError(error)
    }
  };

  const addUser = async (code, name, description) => {
    try {
      const response = await axios.post(url, { code, name, description });
      if (response.status === 200) {
        setAlert('Usuario añadido correctamente.');
        setError(false);
        setNewUserModal(false);
        fetchUserList('');
      }
    } catch (error) {
      console.error(error.message);
      setError(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${url}/${id}`);
      if (response.status === 200) {
        setAlert('Usuario eliminado correctamente.')
        fetchUserList('');
      }
    } catch (error) {
      console.error(error.message);
      setError(error);
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      const response = await axios.put(`${url}/${id}`, updatedUser);
      if (response.status === 200) {
        setAlert('Usuario actualizado correctamente.')
        setError(false);
        setEditUserModal(false);
        fetchUserList('');
      }
    } catch (error) {
      console.error(error.message);
      setError(error);
    }
  };


  useEffect(() => {
    fetchUserList('');
  }, []);
  
  return (
    <div className="container my-4">
      
      <div id='alert'>
        {alert &&
          <Alert variant="success" onClose={() => setAlert(null)} dismissible>
            Petición exitosa: { alert}
          </Alert>}
      </div>

      <h1 className="text-center mb-4">Lista de usuarios</h1>
      <div className="d-flex mb-4">
        <input
          id="filterText"
          type="text"
          className="form-control me-2"
          onChange={(event) => fetchUserList(event.target.value)}
          placeholder="Buscar por nombre o código"
        />
        <Button variant="success" onClick={ () => setNewUserModal(true) }>
          Agregar usuario
        </Button>
      </div>

      <Table striped bordered hover className='text-center'>
        <thead>
          <tr>
            <th>ID</th>
            <th>CÓDIGO</th>
            <th>NOMBRE</th>
            <th>DESCRIPCIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key ={user.id}>
              <td>{user.id}</td>
              <td>{user.code}</td>
              <td>{user.name}</td>
              <td>{user.description}</td>
              <td>
              <Button variant="primary" onClick={ () => { setEditUserModal(true); setSelectedUser(user);
              setEditCode(user.code);
              setEditName(user.name);
              setEditDescription(user.description)}}>
                EDITAR
              </Button>
              <Button variant="danger" onClick={ () => deleteUser(user.id) }>
                ELIMINAR
              </Button>
              </td>
            </tr>
              ))}
        </tbody>
      </Table>

      <Modal show={newUserModal} onHide={() => { setNewUserModal(false); setError(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>AGREGAR USUARIO</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="form-group">
            <label htmlFor="nombre">Codigo:</label>
            <input type="text" className="form-control" id="newUserCode" required/>
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" className="form-control" id="newUserName" required/>
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <input type="text" className="form-control" id="newUserDescription" required/>
          </div>

          <div id='error'>
          {error &&
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              Error en la petición: { error.response.data.message }
            </Alert>}
          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" variant="primary" onClick={() => {
            const code = document.getElementById('newUserCode').value;
            const name = document.getElementById('newUserName').value;
            const description = document.getElementById('newUserDescription').value;
            addUser(code, name, description);
            }}
          >
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={ editUserModal } onHide={ () => { setEditUserModal(false); setError(null) } }>
        <Modal.Header closeButton>
          <Modal.Title>EDITAR PRODUCTO</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="codigo">Código:</label>
            <input type="text" className="form-control" id="putCode" value={ editCode } required onChange={ handleEditCode }/>
          </div>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" className="form-control" id="putName" value={ editName } required onChange={ handleEditName }/>
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <input type="text" className="form-control" id="putDescription" value={ editDescription } required onChange={ handleEditDescription }/>
          </div>

          <div id='error'>
          {error &&
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              Error en la petición: { error.response.data.message }
            </Alert>}
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="primary" onClick={() => {
            const editedUser = {
              "code": editCode,
              "name": editName,
              "description": editDescription
            };
            console.log(editedUser);
            updateUser(selectedUser.id, editedUser);
          }}>
            EDITAR
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}

export default App;