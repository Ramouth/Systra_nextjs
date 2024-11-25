// src/components/save-modal/index.jsx
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Box,
  Modal,
  Select,
  Button,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function SaveModal({ open, onClose, onSave, templates }) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [inputType, setInputType] = useState('select'); // 'select' or 'new'

  const handleSave = () => {
      if (inputType === 'select' && selectedTemplate) {
        onSave({ templateId: parseInt(selectedTemplate, 10) });
      } else if (inputType === 'new' && newTemplateName.trim()) {
        onSave({ templateName: newTemplateName.trim() });
      }
    };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={3}>
          Save Activities as Template
        </Typography>

        <Box mb={2}>
          <Button
            variant={inputType === 'select' ? 'contained' : 'outlined'}
            onClick={() => setInputType('select')}
            sx={{ mr: 1 }}
          >
            Select Existing
          </Button>
          <Button
            variant={inputType === 'new' ? 'contained' : 'outlined'}
            onClick={() => setInputType('new')}
          >
            Create New
          </Button>
        </Box>

        {inputType === 'select' ? (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Template</InputLabel>
            <Select
              value={selectedTemplate}
              label="Select Template"
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              {templates.map((template) => (
                <MenuItem key={template.templateId} value={template.templateId}>
                  {template.templateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            label="New Template Name"
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
            sx={{ mb: 3 }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              (inputType === 'select' && !selectedTemplate) ||
              (inputType === 'new' && !newTemplateName.trim())
            }
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

SaveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      templateId: PropTypes.number.isRequired,
      templateName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SaveModal;