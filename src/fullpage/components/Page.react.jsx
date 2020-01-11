import React, {useEffect} from 'react';
import classes from './Page.module.css';
import {useFullPageContext} from '../context/FullPage.react';

const Page = ({path, _navigate, color, children}) => {
  const {currentPath} = useFullPageContext();
  useEffect(() => {
    if (currentPath === path) {
      _navigate();
    }
  }, [_navigate, currentPath, path]);
  return (
    <div style={{backgroundColor: color}} className={classes.Page}>
      {children}
    </div>
  );
};

export default Page;
