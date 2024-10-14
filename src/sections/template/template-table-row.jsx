import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Popover,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function TemplateTableRow({ row, selected, handleClick, onEdit, onDelete }) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox" sx={{ pl: 3 }}>
          <Checkbox 
            disableRipple 
            checked={selected} 
            onChange={(event) => handleClick(event, row.templateId)} 
          />
        </TableCell>

        <TableCell component="th" scope="row" padding="none" align="left" sx={{ pl: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {row.templateName}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => { onEdit(row); handleCloseMenu(); }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { onDelete(row.templateId); handleCloseMenu(); }} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

TemplateTableRow.propTypes = {
  row: PropTypes.shape({
    templateId: PropTypes.number.isRequired,
    templateName: PropTypes.string.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};