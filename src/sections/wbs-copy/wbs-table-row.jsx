import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Stack,
  Popover,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function WbsTableRow({ row, selected, handleClick, onView, onEdit, onDelete, templateName }) {
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
      <Checkbox disableRipple checked={selected} onChange={(event) => handleClick(event, row.wbsId)} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none" align="left" sx={{ pl: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {row.name}
          </Typography>
        </TableCell>

        <TableCell align="left">{row.date}</TableCell>
        <TableCell align="left">{templateName}</TableCell>

        <TableCell align="center">{row.activities.length}</TableCell>

        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton onClick={onView}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
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
        <MenuItem onClick={() => { onEdit(); handleCloseMenu(); }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { onDelete(); handleCloseMenu(); }} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

WbsTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  templateName: PropTypes.string,
};