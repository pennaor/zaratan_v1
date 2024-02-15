import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import './terrain-overview-section.css';

type SectionProps = {
  title: JSX.Element | string;
  children: JSX.Element | JSX.Element[];
};

export default function TerrainOverviewSection(props: SectionProps) {
  const {
    title, children,
  } = props;

  return (
    <Accordion
      expanded
      disableGutters
      className="terrain-overview-section"
      sx={{
        borderTopRightRadius: '4px',
        borderTopLeftRadius: '4px',
      }}
    >
      <AccordionSummary
        sx={{
          color: 'white',
          backgroundColor: '#38c593',
          borderTopRightRadius: '4px',
          borderTopLeftRadius: '4px',
        }}
      >
        { title }
      </AccordionSummary>
      <AccordionDetails>
        { children }
      </AccordionDetails>
    </Accordion>
  );
}
