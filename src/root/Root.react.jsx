import React from 'react';
import FullPagePanel from './../components/layout/FullPagePanel.react';
import Page from '../components/layout/Page.react';

function Root() {
  return (
    <FullPagePanel direction="vertical">
      <Page color="aqua">
        <h1>Aqua</h1>
      </Page>
      <FullPagePanel direction="horizontal">
        <Page color="beige"><h1>Beige</h1></Page>
        <Page color="crimson"><h1>Crimson</h1></Page>
        <Page color="green"><h1>Green</h1></Page>
        <Page color="yellow"><h1>Yellow</h1></Page>
      </FullPagePanel>
    </FullPagePanel>
  );
}

export default Root;
