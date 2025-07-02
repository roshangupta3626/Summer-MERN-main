import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { serverEndpoint } from '../../config';



const USER_ROLES = ['viewer', 'developer', 'admin'];




function ManageUsers() {
  const [usersData, setUsersData] = useState([]);
  const [formData, setFormData] = useState({ email: '', name: '', role: '', id: '' });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverEndpoint}/users`, { withCredentials: true });
      setUsersData(res.data);
    } catch (error) {
      setErrors({ message: 'Unable to fetch users.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalShow = (edit = false, data = {}) => {
    setIsEdit(edit);
    if (edit) {
      setFormData({ ...data, id: data._id });
    } else {
      setFormData({ email: '', name: '', role: '', id: '' });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);
  const handleDeleteModalShow = (id) => {
    setFormData({ id });
    setShowDeleteModal(true);
  };
  const handleDeleteModalClose = () => setShowDeleteModal(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setFormLoading(true);
    const body = { email: formData.email, name: formData.name, role: formData.role };
    try {
      if (isEdit) {
        await axios.put(`${serverEndpoint}/users/${formData.id}`, body, { withCredentials: true });
      } else {
        await axios.post(`${serverEndpoint}/users`, body, { withCredentials: true });
      }
      fetchUsers();
      handleModalClose();
    } catch {
      setErrors({ message: 'Error saving user. Try again.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await axios.delete(`${serverEndpoint}/users/${formData.id}`, { withCredentials: true });
      fetchUsers();
      handleDeleteModalClose();
    } catch {
      setErrors({ message: 'Delete failed. Try again.' });
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleModalShow(true, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteModalShow(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Users</h2>
        <button className="btn btn-primary btn-sm" onClick={() => handleModalShow(false)}>
          + Add User
        </button>
      </div>

      {errors.message && <div className="alert alert-danger">{errors.message}</div>}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={usersData}
          getRowId={(row) => row._id}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={{ fontFamily: 'inherit' }}
          loading={loading}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {['email', 'name'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  name={field}
                  className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleDeleteModalClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={formLoading}>
            {formLoading ? 'Deleting...' : 'Delete'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageUsers;
