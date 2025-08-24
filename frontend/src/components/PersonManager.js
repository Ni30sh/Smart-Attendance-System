import React, { useState, useEffect } from 'react';
import { personAPI } from '../services/api';

const PersonManager = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await personAPI.getAllPersons();
      setPersons(response.data);
    } catch (err) {
      console.error('Error loading persons:', err);
      setError('Failed to load persons');
    } finally {
      setLoading(false);
    }
  };

  const deletePerson = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await personAPI.deletePerson(id);
        setPersons(persons.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error deleting person:', err);
        setError('Failed to delete person');
      }
    }
  };

  const addPerson = async () => {
    if (!newPersonName.trim()) {
      setError('Person name is required');
      return;
    }

    try {
      const newPerson = {
        personName: newPersonName.trim(),
        encoding: null // Will be populated when face images are uploaded
      };
      
      const response = await personAPI.savePerson(newPerson);
      setPersons([...persons, response.data]);
      setNewPersonName('');
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error adding person:', err);
      setError('Failed to add person');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="person-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Person Management</h4>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className="fas fa-plus me-2"></i>
          Add New Person
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Add New Person</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="personName" className="form-label">
                    Person Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="personName"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    placeholder="Enter person name"
                  />
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success"
                    onClick={addPerson}
                  >
                    <i className="fas fa-save me-2"></i>
                    Save Person
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewPersonName('');
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="alert alert-info">
                  <h6><i className="fas fa-info-circle me-2"></i>Note:</h6>
                  <p className="mb-0">
                    After adding a person, you'll need to add their face images to the 
                    <code>/faces/[person_name]/</code> directory and restart the face 
                    recognition service to enable recognition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Registered Persons</h5>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={loadPersons}
          >
            <i className="fas fa-sync-alt me-1"></i>
            Refresh
          </button>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading persons...</p>
            </div>
          ) : persons.length === 0 ? (
            <div className="text-center text-muted">
              <i className="fas fa-users fa-3x mb-3"></i>
              <p>No persons registered yet.</p>
              <p>Click "Add New Person" to get started.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Face Data</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {persons.map((person) => (
                    <tr key={person.id}>
                      <td>{person.id}</td>
                      <td>
                        <i className="fas fa-user me-2"></i>
                        {person.personName}
                      </td>
                      <td>
                        {person.encoding ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>
                            Available
                          </span>
                        ) : (
                          <span className="badge bg-warning">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            Missing
                          </span>
                        )}
                      </td>
                      <td>{formatDate(person.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deletePerson(person.id)}
                          title="Delete Person"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5>Instructions for Adding Face Data</h5>
        </div>
        <div className="card-body">
          <ol>
            <li>Create a folder in the <code>faces/</code> directory with the exact name of the person</li>
            <li>Add multiple clear photos (JPG or PNG) of the person's face to this folder</li>
            <li>Restart the face recognition service for the changes to take effect</li>
            <li>The face encoding will be automatically generated and stored in the database</li>
          </ol>
          
          <div className="alert alert-warning mt-3">
            <strong>Important:</strong> 
            <ul className="mb-0 mt-2">
              <li>Use clear, well-lit photos with the person looking directly at the camera</li>
              <li>Include multiple photos from different angles for better recognition accuracy</li>
              <li>Folder names must match the person names exactly (case-sensitive)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonManager;