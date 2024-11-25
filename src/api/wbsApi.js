import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const fetchWbsList = async () => {
  const response = await axios.get(`${API_BASE_URL}/wbs`);
  return response.data;
};

export const createWbs = async (wbsData) => {
  const response = await axios.post(`${API_BASE_URL}/wbs`, wbsData);
  return response.data;
};

export const updateWbs = async (wbsId, wbsData) => {
  const response = await axios.put(`${API_BASE_URL}/wbs/${wbsId}`, wbsData);
  return response.data;
};

export const deleteWbs = async (wbsId) => {
  const response = await axios.delete(`${API_BASE_URL}/wbs/${wbsId}`);
  return response.data;
};
export const fetchWbsById = async (wbsId) => {
  const response = await axios.get(`${API_BASE_URL}/wbs/${wbsId}`);
  return response.data;
};
export const fetchActivities = async () => {
  const response = await axios.get(`${API_BASE_URL}/activities`);
  return response.data;
};

export const fetchActivityById = async (activityId) => {
  const response = await axios.get(`${API_BASE_URL}/activities/${activityId}`);
  return response.data;
};

export const createActivity = async (activityData) => {
  const response = await axios.post(`${API_BASE_URL}/activities`, activityData);
  return response.data;
};

export const updateActivity = async (activityId, activityData) => {
  const response = await axios.put(`${API_BASE_URL}/activities/${activityId}`, activityData);
  return response.data;
};

export const deleteActivity = async (activityId) => {
  await axios.delete(`${API_BASE_URL}/activities/${activityId}`);
};

export const updateActivities = async (activityId, activities) => {
  const response = await axios.put(
    `${API_BASE_URL}/activities/${activityId}/activities`,
    activities
  );
  return response.data;
};

export const fetchTemplates = async () => {
  const response = await axios.get(`${API_BASE_URL}/templates`);
  return response.data;
};

export const createTemplate = async (templateData) => {
    const response = await axios.post(`${API_BASE_URL}/templates`, templateData);
    return response.data;
  };
  
  export const updateTemplate = async (templateId, templateData) => {
    const response = await axios.put(`${API_BASE_URL}/templates/${templateId}`, templateData);
    return response.data;
  };
  
  export const deleteTemplate = async (templateId) => {
    const response = await axios.delete(`${API_BASE_URL}/templates/${templateId}`);
    return response.data;
  };
  
  export const fetchTemplateById = async (templateId) => {
    const response = await axios.get(`${API_BASE_URL}/templates/${templateId}`);
    return response.data;
  }; 

  // Copy API
  export const fetchWbsCopyList = async () => {
    const response = await axios.get(`${API_BASE_URL}/wbs-copy`);
    return response.data;
  };

  export const createWbsCopy = async (wbsData) => {
    const response = await axios.post(`${API_BASE_URL}/wbs-copy`, wbsData);
    return response.data;
  };

  export const updateWbsCopy = async (wbsId, wbsData) => {
    const response = await axios.put(`${API_BASE_URL}/wbs-copy/${wbsId}`, wbsData);
    return response.data;
  };

  export const deleteWbsCopy = async (wbsId) => {
    const response = await axios.delete(`${API_BASE_URL}/wbs-copy/${wbsId}`);
    return response.data;
  };

  export const fetchWbsCopyById = async (wbsId) => {
    const response = await axios.get(`${API_BASE_URL}/wbs-copy/${wbsId}`);
    return response.data;
  };

  export const fetchActivitiesCopy = async () => {
    const response = await axios.get(`${API_BASE_URL}/activities-copy`);
    return response.data;
  };

  export const fetchActivityCopyById = async (activityId) => {
    const response = await axios.get(`${API_BASE_URL}/activities-copy/${activityId}`);
    return response.data;
  };

  export const createActivityCopy = async (activityData) => {
    const response = await axios.post(`${API_BASE_URL}/activities-copy`, activityData);
    return response.data;
  };

  export const updateActivityCopy = async (activityId, activityData) => {
    const response = await axios.put(`${API_BASE_URL}/activities-copy/${activityId}`, activityData);
    return response.data;
  };

  export const deleteActivityCopy = async (activityId) => {
    await axios.delete(`${API_BASE_URL}/activities-copy/${activityId}`);
  };

  export const updateActivitiesCopy = async (activityId, activities) => {
    const response = await axios.put(
      `${API_BASE_URL}/activities-copy/${activityId}/activities`,
      activities
    );
    return response.data;
  };

  export const fetchActivitiesByTemplate = async (templateId) => {
    const response = await axios.get(`${API_BASE_URL}/activities-copy/by-template/${templateId}`);
    return response.data;
  };
  
  export const saveActivitiesToTemplate = async (wbsId, templateData) => {
    const response = await axios.post(
      `${API_BASE_URL}/activities/copy-by-wbs/${wbsId}`, 
      templateData
    );
    return response.data;
  };

