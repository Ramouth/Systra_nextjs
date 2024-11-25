import { Helmet } from 'react-helmet-async';

import { WbsView } from 'src/sections/wbs-copy/view';

// ----------------------------------------------------------------------

export default function WbsPage() {
  return (
    <>
      <Helmet>
        <title> Wbs | Systra </title>
      </Helmet>

      <WbsView />
    </>
  );
}
