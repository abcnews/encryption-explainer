import { whenOdysseyLoaded } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import { loadScrollyteller } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import Stage from './components/stage';
import './index.scss';

whenOdysseyLoaded.then(() => {
  const marks = selectMounts('mark', { markAsUsed: false });

  // Hack: Apply right-alignment to all markers
  marks.forEach((el) => (el.id = `${el.id}ALIGNright`));

  const scrollyData = loadScrollyteller('', 'u-full');

  // Hack: restore legacy `idx` and `element` references from odyssey-scrollyteller
  scrollyData.panels
    .filter((panel) => panel.data.id)
    .forEach((panel, index) => {
      panel._idx = index;
      panel._element = panel.nodes[0];
    });

  render(<Stage panels={scrollyData.panels} />, scrollyData.mountNode);
});
