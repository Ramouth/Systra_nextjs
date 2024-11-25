// src/sections/activities-copy/view/activity-view.jsx
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

import { updateActivityCopy, deleteActivityCopy, createActivityCopy, fetchActivitiesByTemplate  } from 'src/api/wbsApi';

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
    const truncateDescription = (description) => {
      const words = description.split(' ');
      if (words.length > 3) {
        return `${words.slice(0, 3).join(' ')}...`;
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
            <Tooltip title={activity.description || 'N/A'} arrow>
              <span>{activity.description ? truncateDescription(activity.description) : 'N/A'}</span>
            </Tooltip>
          </TableCell>
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
  const { templateId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [parentActivity, setParentActivity] = useState(null);
  const [filterName, setFilterName] = useState('');

  const sortActivities = useCallback((activityList) => activityList
    .sort((a, b) => parseInt(a.indexNo, 10) - parseInt(b.indexNo, 10))
    .map(activity => ({
      ...activity,
      sub_activities: activity.sub_activities ? sortActivities(activity.sub_activities) : []
    })), []);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await fetchActivitiesByTemplate(templateId);
      data = sortActivities(data);
      setActivities(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setActivities([]);
      } else {
        setError('Error fetching activities. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [templateId, sortActivities]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceParentId = result.source.droppableId.split('-')[1];
    const destParentId = result.destination.droppableId.split('-')[1];

    if (sourceParentId !== destParentId) {
      return;
    }

    const newActivities = JSON.parse(JSON.stringify(activities));

    const updateIndexes = (activityList) => {
      activityList.forEach((activity, index) => {
        activity.indexNo = (index + 1).toString();
        if (activity.sub_activities) {
          updateIndexes(activity.sub_activities);
        }
      });
    };

    const moveActivity = (activityList) => {
      const [removed] = activityList.splice(result.source.index, 1);
      activityList.splice(result.destination.index, 0, removed);
      updateIndexes(activityList);
    };

    if (sourceParentId === 'root') {
          moveActivity(newActivities);
        } else {
          const findAndMove = (activityList) => {
            const activity = activityList.find(act => act.activityID.toString() === sourceParentId);
            if (activity) {
              moveActivity(activity.sub_activities);
              return true;
            }
            return activityList.some(act => act.sub_activities && findAndMove(act.sub_activities));
          };
          findAndMove(newActivities);
        }

        setActivities(newActivities);

    try {
      const updatePromises = newActivities.flatMap(activity => 
        getUpdatePromises(activity)
      );
      await Promise.all(updatePromises);
    } catch (err) {
      setError('Error updating activities order. Please try again.');
    }
  };

  const getUpdatePromises = (activity) => {
    let promises = [updateActivityCopy(activity.activityID, activity)];
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
        await deleteActivityCopy(activityId);
        await loadActivities();
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
        await updateActivityCopy(editingActivity.activityID, {
          ...activityData,
          templateId: parseInt(templateId, 10),
          parentActivityId: editingActivity.parentActivityId ? editingActivity.parentActivityId : null,
        });
      } else {
        await createActivityCopy({
          ...activityData,
          templateId: parseInt(templateId, 10),
          parentActivityId: parentActivity ? parentActivity.activityID : null,
        });
      }
      await loadActivities();
      handleFormClose();
    } catch (err) {
      setError('Error saving activity. Please try again.');
    }
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const filteredActivities = activities.filter((activity) =>
    activity.activityName.toLowerCase().includes(filterName.toLowerCase())
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={5}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button
          component={Link}
          to="/templates"
          variant="contained"
          color="primary"
        >
          Back to Templates
        </Button>
      </Box>
    </Container>
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Template Activities</Typography>
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
          to="/template"
          variant="outlined"
          color="primary"
          startIcon={<Iconify icon="eva:arrow-back-fill" />}
        >
          Back to Templates
        </Button>
      </Stack>

      {activities.length === 0 ? (
        <Card>
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No activities found for this template
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Get started by adding your first activity
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleAdd}
            >
              Add Activity
            </Button>
          </Box>
        </Card>
      ) : (
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
      )}

      <ActivityForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        activity={editingActivity}
        templateId={templateId}
        isSubActivity={!!parentActivity}
      />
    </Container>
  );
}