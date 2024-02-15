import * as React from 'react';
import { Typography } from '@mui/material';
import TerrainData from 'components/TerrainData';
import { TerrainDimensions, TerrainFronts } from 'types/Terrain';

const dimensionsLabel = ['Frente', 'Direita', 'Esquerda', 'Fundos'];
const dimensionsKeys: (keyof TerrainDimensions)[] = ['front', 'right', 'left', 'back'];

interface DimensionsAndFrontsDataProps {
  dimensions: TerrainDimensions,
  fronts: TerrainFronts,
}

export default function DimensionsAndFrontsData(props : DimensionsAndFrontsDataProps) {
  const { dimensions, fronts } = props;
  return (
    <TerrainData
      keyField="Dimensões & Confrontantes"
    >
      { dimensionsKeys.map((key, index) => (
        <TerrainData
          key={`${key}-${index + 0}`}
          keyField={`• ${dimensionsLabel[index]}`}
          containerSx={{ border: '0px' }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '0.875rem',
              lineHeight: 1.43,
              letterSpacing: '0.01071em',
              padding: '8px 16px 16px',
              textAlign: 'inherit',
              maxWidth: '99.9%',
              wordWrap: 'break-word',
            }}
          >
            { `${dimensions[key]} (m)` }
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '0.875rem',
              lineHeight: 1.43,
              letterSpacing: '0.01071em',
              padding: '8px 16px 16px',
              textAlign: 'inherit',
              maxWidth: '99.9%',
              wordWrap: 'break-word',
            }}
          >
            { fronts[key] }
          </Typography>
        </TerrainData>
      )) }
    </TerrainData>
  );
}
