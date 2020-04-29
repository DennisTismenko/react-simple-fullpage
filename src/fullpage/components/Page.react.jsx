import React from 'react';
import classes from './Page.module.css';

const Page = ({path, children}) => {
  return (
    <div className={classes.Page}>
      {children}
    </div>
  );
};

export default React.memo(Page);
