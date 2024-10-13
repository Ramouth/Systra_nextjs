import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Dialog,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { createWbs, updateWbs } from '../../../api/wbsApi';

const WbsForm = ({ open, onClose, onSubmit, wbs }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
  });

  useEffect(() => {
    if (wbs) {
      setFormData({
        name: wbs.name || '',
        date: wbs.date || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
      });
    }
  }, [wbs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (wbs) {
        await updateWbs(wbs.wbsId, { ...formData, wbsId: wbs.wbsId });
      } else {
        await createWbs(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error submitting WBS:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{wbs ? 'Edit WBS' : 'Add New WBS'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="WBS Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="date"
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">
            {wbs ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

WbsForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  wbs: PropTypes.shape({
    wbsId: PropTypes.number,
    name: PropTypes.string,
    date: PropTypes.string,
  }),
};

export default WbsForm;