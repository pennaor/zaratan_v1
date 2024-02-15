import React, { useEffect, useRef, useState } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';

interface DetailsProps {
  contentHeight: string;
  children: JSX.Element | JSX.Element[];
}

export default function TerrainDataDetails({ contentHeight, children }: DetailsProps) {
  const [overflow, setOverflow] = useState('hidden');
  const [alreadyClicked, setAlreadyClicked] = useState(false);
  const rippleRef = useRef<any>(null);

  const toggleScroll = () => {
    if (overflow === 'overlay') {
      return setOverflow('hidden');
    }
    setOverflow('overlay');
  };

  const clickParser = (ev: React.MouseEvent) => {
    if (!alreadyClicked) {
      return setAlreadyClicked(true);
    }
    if (rippleRef.current) {
      rippleRef.current.start(ev);
      setTimeout(() => rippleRef.current.stop(ev), 100);
    }
    toggleScroll();
  };

  useEffect(() => {
    if (!alreadyClicked) {
      return;
    }
    const timer = setTimeout(() => setAlreadyClicked(false), 200);
    return () => clearTimeout(timer);
  }, [alreadyClicked]);

  return (
    <AccordionDetails
      onClick={clickParser}
      sx={{
        height: contentHeight,
        overflow,
      }}
    >
      {children}
      <TouchRipple
        ref={rippleRef}
        center={false}
      />
    </AccordionDetails>
  );
}
