import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Modal, Spinner } from 'react-bootstrap';

const serverEndpoint = 'http://localhost:5001';

const LinksDashboard = () => {
  const [linksData, setLinksData] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    campaignTitle: '',
    originalUrl: '',
    category: '',
  });

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverEndpoint}/links`, { withCredentials: true });
      const formatted = res.data.data.map(item => ({ ...item, id: item._id }));
      setLinksData(formatted);
    } catch {
      setErrors({ message: 'Unable to fetch links. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.campaignTitle.trim()) {
      newErrors.campaignTitle = 'Title is required';
      isValid = false;
    }
    if (!formData.originalUrl.trim()) {
      newErrors.originalUrl = 'URL is required';
      isValid = false;
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const body = {
        campaignTitle: formData.campaignTitle,
        originalUrl: formData.originalUrl,
        category: formData.category,
      };
      const config = { withCredentials: true };

      if (isEdit) {
        await axios.put(`${serverEndpoint}/links/${formData.id}`, body, config);
      } else {
        await axios.post(`${serverEndpoint}/links`, body, config);
      }

      fetchLinks();
      setFormData({ id: '', campaignTitle: '', originalUrl: '', category: '' });
      setShowModal(false);
      setIsEdit(false);
    } catch {
      setErrors({ message: 'Failed to save link. Please try again.' });
    }
  };

  const handleOpenModal = (editMode, data = {}) => {
    setIsEdit(editMode);
    if (editMode) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category,
      });
    } else {
      setFormData({ id: '', campaignTitle: '', originalUrl: '', category: '' });
    }
    setShowModal(true);
  };

  const [deleteId, setDeleteId] = useState(null);

  const handleShowDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverEndpoint}/links/${deleteId}`, { withCredentials: true });
      fetchLinks();
      handleCloseDeleteModal();
    } catch {
      setErrors({ message: 'Unable to delete the link, please try again.' });
    }
  };

  const columns = [
    { field: 'campaignTitle', headerName: 'Title', flex: 2 },
    {
      field: 'originalUrl',
      headerName: 'Resource URL',
      flex: 3,
      renderCell: (params) => (
        <a
          href={`${serverEndpoint}/links/r/${params.row.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.row.originalUrl}
        </a>
      ),
    },
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickCount', headerName: 'Views', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModal(true, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleShowDeleteModal(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="container py-4">
      {/* <h1>Welcome, User!</h1> */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Affiliate Links Manager</h2>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(false)}>
          + Add Link
        </button>
      </div>

      {errors.message && <div className="alert alert-danger">{errors.message}</div>}

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={linksData}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Edit Link' : 'Add Link'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="campaignTitle"
                className={`form-control ${errors.campaignTitle ? 'is-invalid' : ''}`}
                value={formData.campaignTitle}
                onChange={handleChange}
              />
              {errors.campaignTitle && <div className="invalid-feedback">{errors.campaignTitle}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Resource URL</label>
              <input
                type="text"
                name="originalUrl"
                className={`form-control ${errors.originalUrl ? 'is-invalid' : ''}`}
                value={formData.originalUrl}
                onChange={handleChange}
              />
              {errors.originalUrl && <div className="invalid-feedback">{errors.originalUrl}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this link?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LinksDashboard;
