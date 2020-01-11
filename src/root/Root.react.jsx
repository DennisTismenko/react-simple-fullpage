import React from 'react';
import FullPageSection from '../fullpage/components/FullPageSection.react';
import Page from '../fullpage/components/Page.react';
import {FullPage} from '../fullpage/context/FullPage.react';
import classes from './Root.module.css';

const Root = () => {
  return (
    <FullPage>
      <FullPageSection direction="vertical">
        <Page path="aqua" color="aqua">
          <div className={classes.Page}>
            <h1>Aqua</h1>
          </div>
        </Page>
        <FullPageSection direction="horizontal">
          <Page path="beige" color="beige">
            <div className={classes.Page}>
              <h1>Beige</h1>
            </div>
          </Page>
          <Page path="crimson" color="crimson">
            <div className={classes.Page}>
              <h1>Crimson</h1>
            </div>
          </Page>
          <FullPageSection direction="vertical">
            <Page path="green" color="green">
              <div className={classes.Page}>
                <h1>Green</h1>
              </div>
            </Page>
            <Page path="blue" color="blue">
              <div className={classes.Page}>
                <h1>Blue</h1>
              </div>
            </Page>
          </FullPageSection>
          <Page path="yellow" color="yellow">
            <div className={classes.Page}>
              <h1>Yellow</h1>
            </div>
          </Page>
        </FullPageSection>
      </FullPageSection>
    </FullPage>
  );
};

export default Root;
