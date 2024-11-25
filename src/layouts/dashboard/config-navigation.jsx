import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  /*
   {
   title: 'dashboard',
     path: '/',
     icon: icon('ic_analytics'),
   },
   */
  {
    title: 'template',
    path: '/template',
    icon: icon('ic_blog'),
  },
  {
    title: 'wbs',
    path: '/wbs',
    icon: icon('ic_analytics'),
  },
  
  {
    title: 'logout',
    path: '/logout',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
