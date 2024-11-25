// src/sections/activities/view/activity-view.jsx
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Card,
  Menu,
  Table,
  Stack,
  Button,
  Tooltip,
  MenuItem,
  TableRow,
  Collapse,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  IconButton,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { fetchWbsById, updateActivity, deleteActivity, createActivity } from 'src/api/wbsApi';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ActivityForm from './activity-form';
import ActivityTableToolbar from '../activity-table-toolbar';


// actvity row function 
const ActivityRow = ({ activity, level, parentIndex, onEdit, onDelete, onAddSubActivity, provided }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const fullIndex = parentIndex ? `${parentIndex}.${activity.indexNo}` : activity.indexNo;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length > 1) {
      return `${words.slice(0, 1).join(' ')} ...`;
    }
    return description;
  };

  return (
    <>
      <TableRow ref={provided.innerRef} {...provided.draggableProps}>
        <TableCell sx={{ width: '80px', padding: '0 20px' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box {...provided.dragHandleProps}>
              <DragIndicatorIcon />
            </Box>
            {activity.sub_activities && activity.sub_activities.length > 0 && (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </Stack>
        </TableCell>
        <TableCell>{fullIndex}</TableCell>
        <TableCell>{activity.activityName}</TableCell>
        <TableCell>
          <Tooltip title={activity.description || '- '} arrow>
            <span>{activity.description ? truncateDescription(activity.description) : ' -'}</span>
          </Tooltip>
        </TableCell>
        <TableCell>{activity.time || '-'}</TableCell>
        <TableCell>{activity.repetitions || '-'}</TableCell>
        <TableCell>{activity.cadAdmins || '-'}</TableCell>
        <TableCell>{activity.cadCoords || '-'}</TableCell>
        <TableCell>{activity.sum || '-'}</TableCell>
        <TableCell>
          <IconButton onClick={() => onAddSubActivity(activity)}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => {
              onEdit(activity);
              handleCloseMenu();
            }}>
              <EditIcon sx={{ mr: 2 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => {
              onDelete(activity.activityID);
              handleCloseMenu();
            }} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 2 }} />
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
      {activity.sub_activities && activity.sub_activities.length > 0 && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 0, padding: 0 }}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '60px' }} />
                      <TableCell>Index</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Repetitions</TableCell>
                      <TableCell>CAD Admins</TableCell>
                      <TableCell>CAD Coords</TableCell>
                      <TableCell>Sum</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <NestedActivityList
                    activities={activity.sub_activities}
                    parentId={activity.activityID}
                    level={level + 1}
                    parentIndex={fullIndex}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddSubActivity={onAddSubActivity}
                  />
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const NestedActivityList = ({ activities, parentId, level, parentIndex, onEdit, onDelete, onAddSubActivity }) => (
  <Droppable droppableId={`droppable-${parentId}`} type={`${level}`}>
    {(provided) => (
      <TableBody ref={provided.innerRef} {...provided.droppableProps}>
        {activities.map((activity, index) => (
          <Draggable key={activity.activityID} draggableId={activity.activityID.toString()} index={index}>
            {(providedDraggable) => (
              <ActivityRow
                activity={activity}
                level={level}
                parentIndex={parentIndex}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubActivity={onAddSubActivity}
                provided={providedDraggable}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </TableBody>
    )}
  </Droppable>
);


ActivityRow.propTypes = {
  activity: PropTypes.shape({
    indexNo: PropTypes.string.isRequired,
    activityName: PropTypes.string.isRequired,
    description: PropTypes.string,
    time: PropTypes.number,
    repetitions: PropTypes.number,
    cadAdmins: PropTypes.number,
    cadCoords: PropTypes.number,
    sum: PropTypes.number,
    activityID: PropTypes.number.isRequired,
    sub_activities: PropTypes.array
  }).isRequired,
  level: PropTypes.number.isRequired,
  parentIndex: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddSubActivity: PropTypes.func.isRequired,
  provided: PropTypes.shape({
    innerRef: PropTypes.func.isRequired,
    draggableProps: PropTypes.object.isRequired,
    dragHandleProps: PropTypes.object.isRequired
  }).isRequired
};

NestedActivityList.propTypes = {
  activities: PropTypes.array.isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  level: PropTypes.number.isRequired,
  parentIndex: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddSubActivity: PropTypes.func.isRequired
};

export default function ActivityView() {
  const { wbsId } = useParams();
  const [wbs, setWbs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [parentActivity, setParentActivity] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [adminHeader, setAdminHeader] = useState('CAD Admins');
  const [coordHeader, setCoordHeader] = useState('CAD Coords');
  
  const sortActivities = useCallback((activities) => activities
    .sort((a, b) => parseInt(a.indexNo, 10) - parseInt(b.indexNo, 10))
    .map(activity => ({
      ...activity,
      sub_activities: activity.sub_activities ? sortActivities(activity.sub_activities) : []
    })), []);

  const loadWbs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWbsById(wbsId);
      data.activities = sortActivities(data.activities);
      setWbs(data);
      // Set the header names if they exist in the response
      if (data.cadAdmins) setAdminHeader(data.cadAdmins);
      if (data.cadCoords) setCoordHeader(data.cadCoords);
    } catch (err) {
      setError('Error fetching WBS activities. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [wbsId, sortActivities]);

  useEffect(() => {
    loadWbs();
  }, [loadWbs]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceParentId = result.source.droppableId.split('-')[1];
    const destParentId = result.destination.droppableId.split('-')[1];

    if (sourceParentId !== destParentId) {
      // Prevent dragging between different levels
      return;
    }

    const newActivities = JSON.parse(JSON.stringify(wbs.activities));

    const updateIndexes = (activities) => {
      activities.forEach((activity, index) => {
        activity.indexNo = (index + 1).toString();
        if (activity.sub_activities) {
          updateIndexes(activity.sub_activities);
        }
      });
    };

    const moveActivity = (activities) => {
      const [removed] = activities.splice(result.source.index, 1);
      activities.splice(result.destination.index, 0, removed);
      updateIndexes(activities);
    };

    if (sourceParentId === 'root') {
      moveActivity(newActivities);
    } else {
      const findAndMove = (activities) => {
        const activity = activities.find(act => act.activityID.toString() === sourceParentId);
        if (activity) {
          moveActivity(activity.sub_activities);
          return true;
        }
        return activities.some(act => act.sub_activities && findAndMove(act.sub_activities));
      };
      findAndMove(newActivities);
    }

    setWbs({ ...wbs, activities: newActivities });

    try {
      // Update activities in the backend
      const updatePromises = newActivities.flatMap(activity =>
        getUpdatePromises(activity)
      );
      await Promise.all(updatePromises);
    } catch (err) {
      setError('Error updating activities order. Please try again.');
    }
  };

  const getUpdatePromises = (activity) => {
    let promises = [updateActivity(activity.activityID, activity)];
    if (activity.sub_activities) {
      promises = promises.concat(activity.sub_activities.flatMap(subActivity =>
        getUpdatePromises(subActivity)
      ));
    }
    return promises;
  };

  const handleAdd = () => {
    setEditingActivity(null);
    setParentActivity(null);
    setIsFormOpen(true);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setParentActivity(null);
    setIsFormOpen(true);
  };

  const handleAddSubActivity = (parent) => {
    setEditingActivity(null);
    setParentActivity(parent);
    setIsFormOpen(true);
  };

  const handleDelete = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(activityId);
        await loadWbs();
      } catch (err) {
        setError('Error deleting activity. Please try again.');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingActivity(null);
    setParentActivity(null);
  };

  const handleFormSubmit = async (activityData) => {
    try {
      if (editingActivity) {
        await updateActivity(editingActivity.activityID, {
          ...activityData,
          wbsId: parseInt(wbsId, 10),
          parentActivityId: editingActivity.parentActivityId ? editingActivity.parentActivityId : null,
          templateId: editingActivity.templateId ? editingActivity : null
        });
      } else {
        await createActivity({
          ...activityData,
          wbsId: parseInt(wbsId, 10),
          parentActivityId: parentActivity ? parentActivity.activityID : null,
          templateId: null
        });
      }
      await loadWbs();
      handleFormClose();
    } catch (err) {
      setError('Error saving activity. Please try again.');
    }
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleExportToExcel = () => {
    const flattenActivities = (activities, parentIndex = '') =>
      activities.flatMap((activity, index) => {
        const currentIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
        const currentActivityData = {
          Index: currentIndex,
          Name: activity.activityName,
          Description: activity.description || '-',
          Time: activity.time || '-',
          Repetitions: activity.repetitions || '-',
          CAD_Admins: activity.cadAdmins || '-',
          CAD_Coords: activity.cadCoords || '-',
          Sum: activity.sum || '-'
        };

        // Recursively flatten sub-activities
        const subActivitiesData = activity.sub_activities
          ? flattenActivities(activity.sub_activities, currentIndex)
          : [];

        return [currentActivityData, ...subActivitiesData];
      });

    // Get flattened activity data
    const data = flattenActivities(filteredActivities);

    // Transform data to display multi-level Index with full hierarchy in Sub_Index and Sub_Sub_Index
    const formattedData = data.map((activity) => {
      const indexParts = activity.Index.split(".");

      return {
        Main_Index: indexParts.length === 1 ? activity.Index : "",          // Display in Main_Index only for top level
        Sub_Index: indexParts.length === 2 ? activity.Index : "",           // Display full "2.1" format for second level
        Sub_Sub_Index: indexParts.length === 3 ? activity.Index : "",       // Display full "2.1.1" format for third level
        Name: activity.Name,
        Description: activity.Description,
        Time: activity.Time,
        Repetitions: activity.Repetitions,
        CAD_Admins: activity.CAD_Admins,
        CAD_Coords: activity.CAD_Coords,
        Sum: activity.Sum
      };
    });

    // Convert formatted data to worksheet and export to Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
    XLSX.writeFile(workbook, "activities.xlsx");
  };


  const calculateTotal = (activities, property) =>
    activities.reduce(
      (total, activity) =>
        total + (parseFloat(activity[property]) || 0) + (activity.sub_activities ? calculateTotal(activity.sub_activities, property) : 0),
      0
    );

  const formatNumberWithDots = (value) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const filteredActivities = wbs ? wbs.activities.filter((activity) =>
    activity.activityName.toLowerCase().includes(filterName.toLowerCase())
  ) : [];

  // Total calculations for all relevant fields
  const totalTime = calculateTotal(filteredActivities, 'time');
  const totalRepetitions = calculateTotal(filteredActivities, 'repetitions');
  const totalCadAdmins = calculateTotal(filteredActivities, 'cadAdmins');
  const totalCadCoords = calculateTotal(filteredActivities, 'cadCoords');
  const totalSum = calculateTotal(filteredActivities, 'sum');


  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!wbs) return <Typography>No WBS found with the given ID.</Typography>;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">
          Activities for WBS: {wbs.name}
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAdd}
        >
          New Activity
        </Button>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Button
          component={Link}
          to="/wbs"
          variant="outlined"
          color="primary"
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
        >
          Back to WBS List
        </Button>
        {/* Add Export Button here */}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
      </Stack>

      <Card>
        <ActivityTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold', color: 'grey' }} />
                    <TableCell style={{ fontWeight: 'bold' }}>Index</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Repetitions</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{adminHeader}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>{coordHeader}</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Sum</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <NestedActivityList
                  activities={filteredActivities}
                  parentId="root"
                  level={0}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddSubActivity={handleAddSubActivity}
                />
                {/* Total row for sums */}
                <TableBody>
                  <TableRow style={{ backgroundColor: '#FFFFFF', fontWeight: 'bold' }}>
                    <TableCell colSpan={4} style={{ textAlign: 'Left', fontWeight: 'bold' }}>Total:</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>{formatNumberWithDots(totalTime)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'black' }} >{formatNumberWithDots(totalRepetitions)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'black' }} >{formatNumberWithDots(totalCadAdmins)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'black' }} >{formatNumberWithDots(totalCadCoords)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>{formatNumberWithDots(totalSum)}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>{}</TableCell>

                  </TableRow>
                </TableBody>
              </Table>
            </DragDropContext>
          </TableContainer>
        </Scrollbar>
      </Card>

      <ActivityForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        activity={editingActivity}
        wbsId={wbsId}
        isSubActivity={!!parentActivity}
      />
    </Container>
  );
}
