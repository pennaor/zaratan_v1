import React from 'react';
import { Typography, Divider, Box } from '@mui/material';
import Buyer from 'components/Buyer';
import TerrainDataSection from '../TerrainDataSection';
import { Buyer as BuyerType } from '../../types/Terrain';

type SectionProps = {
  buyers: BuyerType[];
};

export default function BuyersSection({ buyers }: SectionProps) {
  return (
    <TerrainDataSection
      title="Compradores"
      contentHeight={buyers.length ? undefined : 'fit-content'}
    >
      { buyers.length
        ? buyers.map((buyer, index) => (
          <Box key={`buyer-${buyer.id}`}>
            <Buyer
              buyer={buyer}
            />
            {
              index < buyers.length - 1 && (
                <Divider
                  variant="middle"
                  sx={{
                    borderWidth: '2px',
                    borderRadius: '2px',
                    borderColor: '#38c593',
                    marginY: 3,
                  }}
                />
              )
            }
          </Box>
        ))
        : (
          <Typography
            variant="subtitle2"
            padding={1}
            textAlign="center"
            data-testid="buyers-not-found"
          >
            Nenhum comprador registrado
          </Typography>
        )}
    </TerrainDataSection>
  );
}
