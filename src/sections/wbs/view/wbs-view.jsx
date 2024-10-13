import { useNavigate } from 'react-router-dom';
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

import WbsForm from './wbs-form';
import TableNoData from '../table-no-data';
import WbsTableRow from '../wbs-table-row';
import WbsTableHead from '../wbs-table-head';
import TableEmptyRows from '../table-empty-rows';
import WbsTableToolbar from '../wbs-table-toolbar';
import { deleteWbs, fetchWbsList } from '../../../api/wbsApi';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function WbsPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [wbsList, setWbsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWbs, setEditingWbs] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadWbsList();
  }, []);

  const loadWbsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWbsList();
      setWbsList(data);
    } catch (err) {
      setError('Error fetching WBS list. Please try again later.');
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
      const newSelecteds = wbsList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleView = (wbsId) => {
    navigate(`/activities/${wbsId}`);
  };

  const handleEdit = (wbs) => {
    setEditingWbs(wbs);
    setIsFormOpen(true);
  };

  const handleDelete = async (wbsId) => {
    if (window.confirm('Are you sure you want to delete this WBS?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteWbs(wbsId);
        await loadWbsList();
      } catch (err) {
        setError('Error deleting WBS. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdd = () => {
    setEditingWbs(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingWbs(null);
  };

  const handleFormSubmit = async () => {
    await loadWbsList();
    handleFormClose();
  };

  const dataFiltered = applyFilter({
    inputData: wbsList,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">WBS List</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd}>
          New WBS
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Card>
        <WbsTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 300 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <WbsTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={wbsList.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Name', align: 'left' },
                    { id: 'date', label: 'Date', align: 'left' },
                    { id: 'activities', label: 'Activities', align: 'center' },
                    { id: '', label: 'Actions'},
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <WbsTableRow
                        key={row.wbsId}
                        row={row}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        onView={() => handleView(row.wbsId)}
                        onEdit={() => handleEdit(row)}
                        onDelete={() => handleDelete(row.wbsId)}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, wbsList.length)}
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
          count={wbsList.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 15, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <WbsForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        wbs={editingWbs}
      />
    </Container>
  );
}