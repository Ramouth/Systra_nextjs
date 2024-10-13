// src/pages/activities.jsx
import { Helmet } from 'react-helmet-async';

import { ActivityView } from 'src/sections/activities/view';

// ----------------------------------------------------------------------

export default function ActivityPage() {
  return (
    <>
      <Helmet>
        <title> Activities | Systra </title>
      </Helmet>

      <ActivityView />
    </>
  );
}