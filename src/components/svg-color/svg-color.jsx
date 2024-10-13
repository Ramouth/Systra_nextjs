import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

const SvgColor = forwardRef(({ src, sx, ...other }, ref) => (
  <Stack
    component="span"
    className="svg-color"
    ref={ref}
    sx={{
      width: 24,
      height: 24,
      display: 'inline-block',
      bgcolor: 'currentColor',
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
    {...other}
  />
));

SvgColor.propTypes = {
  src: PropTypes.string,
  sx: PropTypes.object,
};

export default SvgColor;
