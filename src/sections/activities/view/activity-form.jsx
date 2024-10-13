// src/sections/activities/activity-form.jsx
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
    Grid,
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

function ActivityForm({ open, onClose, onSubmit, activity, wbsId }) {
    const [formData, setFormData] = useState({
        activityName: '',
        indexNo: '',
        description: '',
        time: 0,
        repetitions: 0,
        cadAdmins: 0,
        cadCoords: 0,
        sum: 0,
        wbsId,
        parentActivityId: 0,
        templateId: 0
    });

    useEffect(() => {
        if (activity) {
            setFormData({
                activityName: activity.activityName || '',
                indexNo: activity.indexNo || '',
                description: activity.description || '',
                time: activity.time || 0,
                repetitions: activity.repetitions || 0,
                cadAdmins: activity.cadAdmins || 0,
                cadCoords: activity.cadCoords || 0,
                sum: activity.sum || 0,
                wbsId: activity.wbsId || wbsId,
                parentActivityId: activity.parentActivityId || 0,
                templateId: activity.templateId || 0
            });
        } else {
            setFormData({
                activityName: '',
                indexNo: '',
                description: '',
                time: 0,
                repetitions: 0,
                cadAdmins: 0,
                cadCoords: 0,
                sum: 0,
                wbsId,
                parentActivityId: 0,
                templateId: 0
            });
        }
    }, [activity, wbsId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{activity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="activityName"
                                label="Activity Name"
                                type="text"
                                fullWidth
                                value={formData.activityName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="indexNo"
                                label="Index Number"
                                type="text"
                                fullWidth
                                value={formData.indexNo}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                name="description"
                                label="Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="time"
                                label="Time"
                                type="number"
                                fullWidth
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="repetitions"
                                label="Repetitions"
                                type="number"
                                fullWidth
                                value={formData.repetitions}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="cadAdmins"
                                label="CAD Admins"
                                type="number"
                                fullWidth
                                value={formData.cadAdmins}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                name="cadCoords"
                                label="CAD Coords"
                                type="number"
                                fullWidth
                                value={formData.cadCoords}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                name="sum"
                                label="Sum"
                                type="number"
                                fullWidth
                                value={formData.sum}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" color="primary">
                        {activity ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

ActivityForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    activity: PropTypes.object,
    wbsId: PropTypes.string.isRequired,
};

export default ActivityForm;