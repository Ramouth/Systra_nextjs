import React, { useState, useEffect } from 'react';

import {
  Card,
  Table,
  Stack,
  Alert,
  Button,
  TableBody,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TemplateForm from './template-form';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import TemplateTableRow from '../template-table-row';
import TemplateTableHead from '../template-table-head';
import TemplateTableToolbar from '../template-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { deleteTemplate, fetchTemplates } from '../../../api/wbsApi';

export default function TemplatePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('templateName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    loadTemplateList();
  }, []);

  const loadTemplateList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTemplates();
      setTemplateList(data);
    } catch (err) {
      setError('Error fetching template list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = templateList.map((n) => n.templateId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selected.length} selected templates?`)) {
      setLoading(true);
      setError(null);

      const deletePromises = selected.map((templateId) => deleteTemplate(templateId));

      Promise.all(deletePromises)
        .then(() => loadTemplateList())
        .then(() => setSelected([]))
        .catch((err) => {
          setError('Error deleting selected templates. Please try again later.');
          console.error('Error deleting templates:', err);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteTemplate(templateId);
        await loadTemplateList();
      } catch (err) {
        setError('Error deleting template. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTemplate(null);
  };

  const handleFormSubmit = async () => {
    await loadTemplateList();
    handleFormClose();
  };

  const dataFiltered = applyFilter({
    inputData: templateList,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Template List</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
        >
          New Template
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <TemplateTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 300 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <TemplateTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={templateList.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'templateName', label: 'Template Name', align: 'left' },
                    { id: '', label: 'Actions', align: 'center' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TemplateTableRow
                        key={row.templateId}
                        row={row}
                        selected={selected.indexOf(row.templateId) !== -1}
                        handleClick={(event) => handleClick(event, row.templateId)}
                        onEdit={() => handleEdit(row)}
                        onDelete={() => handleDelete(row.templateId)}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, templateList.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={templateList.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 15, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <TemplateForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        template={editingTemplate}
      />
    </Container>
  );
}
