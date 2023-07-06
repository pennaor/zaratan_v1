import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Alert, Grid, Pagination, Stack,
} from '@mui/material';
import { useFetch } from '../../hooks/useFetch';
import { Terrain as TerrainType } from '../../types/Terrain';
import Main from '../Main';
import Terrain from '../Terrain';
import useQuery from '../../hooks/useQuery';
import CollapsableSearchForm from '../CollapsableSearchForm';
import ScrollTop from '../ScrollTop';
import ScrollBottom from '../ScrollBottom';

// import { elevenTerrains } from '../../tests/mocks/terrains';
// const response = { data: elevenTerrains };
// const loading = false;

const pageElements = 10;

export default function Terrains(): JSX.Element {
  const [page, setPage] = useState(1);

  const {
    response,
    loading,
  } = useFetch<TerrainType[]>('GET', '/terrain');

  const searchParams = useQuery();

  const paginate = useCallback((terrains: TerrainType[]) => {
    const end = pageElements * page;
    const start = end - pageElements;
    return terrains.slice(start, end);
  }, [page]);

  const terrains = useMemo(() => {
    if (!response || !Array.isArray(response.data)) {
      return [];
    }
    return response.data.filter(({ details }) => {
      const block = Number(searchParams.get('block'));
      const terrain = Number(searchParams.get('terrain'));
      if (!block) {
        return true;
      }
      if (terrain) {
        return block === details.block && terrain === details.number;
      }
      return block === details.block;
    });
  }, [response, searchParams]);

  const totalPages = useMemo(() => {
    const total = Math.ceil(terrains.length / pageElements);
    if (total < 1) {
      return 1;
    }
    return total;
  }, [terrains]);

  useEffect(() => setPage(1), [terrains]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor && anchor.scrollIntoView) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
    setPage(value);
  };

  return (
    <Main childrenIsLoading={loading}>
      <CollapsableSearchForm setPage={setPage} />
      {terrains.length ? (
        <Grid
          container
          justifyContent="center"
          gap={5}
        >
          {paginate(terrains).map((terrain) => (
            <Terrain
              key={terrain.details.id}
              terrain={terrain}
            />
          ))}
          <Grid
            container
            item
            justifyContent="center"
          >
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                size="small"
                color="primary"
                variant="outlined"
                shape="rounded"
                siblingCount={0}
                boundaryCount={1}
                getItemAriaLabel={(type, pageNumber) => `go to ${type} ${pageNumber}`}
              />
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Alert
          severity="info"
          variant="standard"
          sx={{
            justifyContent: 'center',
            maxWidth: '490px',
            marginX: 'auto',
          }}
        >
          Nenhum lote encontrado
        </Alert>
      )}
      <ScrollTop />
      <ScrollBottom />
    </Main>
  );
}
