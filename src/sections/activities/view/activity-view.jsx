// src/sections/activities/view/activity-view.jsx
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
          <TableCell style={{ paddingLeft: `${level * 10}px` }}>{activity.activityName}</TableCell>
          <TableCell>{activity.description || 'N/A'}</TableCell>
          <TableCell>{activity.time || 'N/A'}</TableCell>
          <TableCell>{activity.repetitions || 'N/A'}</TableCell>
          <TableCell>{activity.cadAdmins || 'N/A'}</TableCell>
          <TableCell>{activity.cadCoords || 'N/A'}</TableCell>
          <TableCell>{activity.sum || 'N/A'}</TableCell>
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
                {/* <Box sx={{ margin: 1 }}> */}
                  <Table size="medium">
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
                {/* </Box> */}
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
          parentActivityId: editingActivity.parentActivityId,
          templateId: editingActivity.templateId || 0
        });
      } else {
        await createActivity({
          ...activityData,
          wbsId: parseInt(wbsId, 10),
          parentActivityId: parentActivity ? parentActivity.activityID : 0,
          templateId: 0
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

  const filteredActivities = wbs ? wbs.activities.filter((activity) =>
    activity.activityName.toLowerCase().includes(filterName.toLowerCase())
  ) : [];

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
                  activities={filteredActivities}
                  parentId="root"
                  level={0}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddSubActivity={handleAddSubActivity}
                />
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