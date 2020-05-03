import React from 'react';
import FullPageSection from '../../../src/fullpage/components/FullPageSection.react';
import Page from '../../../src/fullpage/components/Page.react';
import {FullPage} from '../../../src/fullpage/context/FullPage.react';
import classes from './Root.module.css';

const Root = () => {
  return (
    <FullPage>
      <FullPageSection orientation="vertical">
        <Page path="aqua" color="aqua">
          <div className={[classes.Page, classes['bg-aqua']].join(' ')}>
            <h1>Aqua</h1>
          </div>
        </Page>
        <FullPageSection orientation="horizontal">
          <Page path="beige" color="beige">
            <div className={[classes.Page, classes['bg-beige']].join(' ')}>
              <h1>Beige</h1>
            </div>
          </Page>
          <Page path="crimson" color="crimson">
            <div className={[classes.Page, classes['bg-crimson']].join(' ')}>
              <h1>Crimson</h1>
            </div>
          </Page>
          <FullPageSection orientation="vertical">
            <Page path="green" color="green">
              <div className={[classes.Page, classes['bg-green']].join(' ')}>
                <h1>Green</h1>
              </div>
            </Page>
            <Page path="blue" color="blue">
              <div className={[classes.Page, classes['bg-blue']].join(' ')}>
                <h1>Blue</h1>
              </div>
            </Page>
          </FullPageSection>
          <Page path="yellow" color="yellow">
            <div className={[classes.Page, classes['bg-yellow']].join(' ')}>
              <h1>Yellow</h1>
            </div>
          </Page>
        </FullPageSection>
      </FullPageSection>
    </FullPage>
  );
};

export default Root;
