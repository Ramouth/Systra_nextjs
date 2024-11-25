// src/pages/activities.jsx
import { Helmet } from 'react-helmet-async';

import { ActivityView } from 'src/sections/activities-copy/view';

// ----------------------------------------------------------------------

export default function ActivityPage() {
  return (
    <>
      <Helmet>
        <title> Activities | Systrs </title>
      </Helmet>

      <ActivityView />
    </>
  );
}