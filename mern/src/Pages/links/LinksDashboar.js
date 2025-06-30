import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const LinksDashboard = () => {
  const [linksData, setLinksData] = useState([]);
  const [errors, setErrors] = useState(null);
  const [formData, setFormData] = useState({
    campaignTitle: '',
    originalUrl: '',
    category: '',
  });

  const serverEndpoint = 'http://localhost:5001';

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links`, { withCredentials: true });
      const data = response.data.data.map((item) => ({
        ...item,
        id: item._id,
      }));
      setLinksData(data);
    } catch (error) {
      setErrors({ message: 'Unable to fetch links. Try again later.' });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddLink = async () => {
    const { campaignTitle, originalUrl, category } = formData;
    if (!campaignTitle || !originalUrl || !category) {
      setErrors({ message: 'All fields are required.' });
      return;
    }

    try {
      await axios.post(
        `${serverEndpoint}/links`,
        formData,
        { withCredentials: true }
      );
      setFormData({ campaignTitle: '', originalUrl: '', category: '' });
      setErrors(null);
      fetchLinks();
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ message: 'Unauthorized. Please log in first.' });
      } else {
        setErrors({ message: 'Failed to add link. Please try again.' });
      }
    }
  };

  const columns = [
    { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
    { field: 'originalUrl', headerName: 'Original URL', flex: 3 },
    { field: 'category', headerName: 'Category', flex: 2 },
    { field: 'clickCount', headerName: 'Clicks', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: () => (
        <IconButton>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Manage Affiliate Links</h2>
        <button className="btn btn-primary btn-sm" onClick={handleAddLink}>
          + ADD
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Campaign Title"
            name="campaignTitle"
            value={formData.campaignTitle}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Original URL"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={linksData}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          sx={{ fontFamily: 'inherit' }}
        />
      </div>

      {errors && <p className="text-danger mt-3">{errors.message}</p>}
    </div>
  );
};

export default LinksDashboard;
