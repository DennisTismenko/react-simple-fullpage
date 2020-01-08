import React from 'react';
import classes from './style/Page.module.css';

const Page = ({color, children}) => {
  return (
    <div
      style={{backgroundColor: color}}
      className={classes.Page}
    >
      {children}
    </div>
  );
};

export default Page;
