import React from 'react';
import ReactDOM from 'react-dom';
import { inDev } from '@common/helpers';
import WindowFrame from '@misc/window/components/WindowFrame';
import Application from './views/Application'

// Application to Render
const app = (
  <WindowFrame title='Games Bunker Pos' platform='windows'>
    <Application />
  </WindowFrame>
);

// Render application in DOM
ReactDOM.render(app, document.getElementById('app'));

// Hot module replacement
if (inDev() && module.hot) module.hot.accept();
