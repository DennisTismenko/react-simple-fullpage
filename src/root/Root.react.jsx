import React from 'react';
import FullPageSection from '../fullpage/components/FullPageSection.react';
import Page from '../components/layout/Page.react';
import {FullPage} from '../fullpage/context/FullPage.react';

const Root = () => {
  return (
    <FullPage>
      <FullPageSection direction="vertical">
        <Page color="aqua">
          <h1>Aqua</h1>
        </Page>
        <FullPageSection direction="horizontal">
          <Page color="beige">
            <h1>Beige</h1>
          </Page>
          <Page color="crimson">
            <h1>Crimson</h1>
          </Page>
          <Page color="green">
            <h1>Green</h1>
          </Page>
          <Page color="yellow">
            <h1>Yellow</h1>
          </Page>
        </FullPageSection>
      </FullPageSection>
    </FullPage>
  );
};

export default Root;
