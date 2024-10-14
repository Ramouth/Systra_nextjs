import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { createWbs, updateWbs, fetchTemplates } from '../../../api/wbsApi';

const WbsForm = ({ open, onClose, onSubmit, wbs }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    templateId: '',
  });
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  useEffect(() => {
    if (wbs) {
      setFormData({
        name: wbs.name || '',
        date: wbs.date || '',
        templateId: wbs.templateId || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        templateId: '',
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
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.templateId) {
        delete dataToSubmit.templateId;
      }

      if (wbs) {
        await updateWbs(wbs.wbsId, { ...dataToSubmit, wbsId: wbs.wbsId });
      } else {
        await createWbs(dataToSubmit);
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="template-select-label">Template</InputLabel>
            <Select
              labelId="template-select-label"
              id="template-select"
              name="templateId"
              value={formData.templateId}
              onChange={handleChange}
              label="Template"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {templates.map((template) => (
                <MenuItem key={template.templateId} value={template.templateId}>
                  {template.templateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
    templateId: PropTypes.number,
  }),
};

export default WbsForm;