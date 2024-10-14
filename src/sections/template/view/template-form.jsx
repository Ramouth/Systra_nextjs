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

import { createTemplate, updateTemplate } from '../../../api/wbsApi';

const TemplateForm = ({ open, onClose, onSubmit, template }) => {
  const [formData, setFormData] = useState({
    templateName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        templateName: template.templateName || '',
      });
    } else {
      setFormData({
        templateName: '',
      });
    }
  }, [template]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      if (template) {
        await updateTemplate(template.templateId, formData);
      } else {
        await createTemplate(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error submitting template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Submitting...';
    return template ? 'Update' : 'Add';
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{template ? 'Edit Template' : 'Add New Template'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="templateName"
            label="Template Name"
            type="text"
            fullWidth
            value={formData.templateName}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {getButtonText()}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

TemplateForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  template: PropTypes.shape({
    templateId: PropTypes.number,
    templateName: PropTypes.string,
  }),
};

export default TemplateForm;
