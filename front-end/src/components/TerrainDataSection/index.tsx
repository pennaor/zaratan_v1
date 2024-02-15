import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography, useMediaQuery } from '@mui/material';
import './terrainDataSection.css';
import TerrainDataDetails from '../TerrainDataDetails';

type Title = JSX.Element | string;

type SectionProps = {
  title: Title;
  defaultExpanded?: boolean;
  contentHeight?: string;
  className?: string;
  children: JSX.Element | JSX.Element[];
};

function SectionTitle(props: { title: Title }): JSX.Element {
  const { title } = props;
  if (typeof title === 'string') {
    return (
      <Typography color="white">
        { title }
      </Typography>
    );
  }
  return title;
}

export default function TerrainDataSection(props: SectionProps) {
  const {
    title,
    defaultExpanded,
    contentHeight = '400px',
    className = 'terrain-data-section',
    children,
  } = props;

  const mw600 = useMediaQuery('(min-width:600px)');

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      className={className}
      sx={{
        borderTopRightRadius: '4px',
        borderTopLeftRadius: '4px',
      }}
      TransitionProps={{
        timeout: mw600 ? 150 : 0,
        unmountOnExit: true,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon htmlColor="white" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          borderTopRightRadius: '4px',
          borderTopLeftRadius: '4px',
          cursor: 'none',
        }}
      >
        <SectionTitle
          title={title}
        />
      </AccordionSummary>
      <TerrainDataDetails
        contentHeight={contentHeight}
      >
        { children }
      </TerrainDataDetails>
    </Accordion>
  );
}
