import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import {
  Button, Collapse, Grid, IconButton, IconButtonProps, Paper, Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(20deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

type CollapsableFormProps = {
  setPage: (value: React.SetStateAction<number>) => void;
};

export default function CollapsableSearchForm({ setPage }: CollapsableFormProps) {
  const [blockField, setBlockField] = useState('');
  const [terrainField, setTerrainField] = useState('');
  const [expanded, setExpanded] = useState(false);

  const history = useHistory();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const onSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault();
    setPage(() => 1);
    history.push(`/lotes?block=${blockField}&terrain=${terrainField}`);
  };

  return (
    <Grid
      container
      justifyContent="center"
      item
      xs={12}
      gap={2}
      marginBottom={3}
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: 'transparent',
      }}
    >
      <Grid
        container
        justifyContent="center"
      >
        <Grid
          container
          alignItems="center"
          flexBasis="fit-content"
          onClick={handleExpandClick}
          data-testid="'search-form-collapsable-toggler'"
        >
          <ExpandMore
            expand={expanded}
            aria-expanded={expanded}
            aria-label="Buscar"
            sx={{
              color: '#38c593',
              fontSize: '50px',
            }}
          >
            <TravelExploreIcon
              color="inherit"
              fontSize="inherit"
            />
          </ExpandMore>
          <Typography
            variant="h5"
            sx={{ cursor: 'pointer' }}
          >
            Buscar ...
          </Typography>
        </Grid>
      </Grid>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Paper
          component="form"
          sx={{
            flexBasis: '90%',
            maxWidth: '770px',
          }}
          noValidate
          autoComplete="off"
        >
          <Grid
            container
            justifyContent="center"
            gap={2}
            paddingX={1}
            paddingY={2}
          >
            <TextField
              variant="filled"
              size="small"
              FormHelperTextProps={{ sx: { textAlign: 'center' } }}
              type="text"
              name="block"
              label="Quadra"
              onChange={(ev) => setBlockField(ev.target.value)}
              inputProps={{ 'data-testid': 'search-form-collapsable-block-input' }}
            />
            <TextField
              variant="filled"
              size="small"
              FormHelperTextProps={{ sx: { textAlign: 'center' } }}
              type="text"
              name="terrain"
              label="Lote"
              onChange={(ev) => setTerrainField(ev.target.value)}
              disabled={!blockField.length}
              inputProps={{ 'data-testid': 'search-form-collapsable-terrain-input' }}
            />
          </Grid>

          <Grid
            container
            justifyContent="center"
            paddingX={1}
            paddingTop={1}
            paddingBottom={2}
          >
            <Button
              type="submit"
              variant="contained"
              onClick={onSubmit}
              sx={{
                backgroundColor: '#38c593',
                color: 'white',
              }}
              disabled={!blockField.length}
              data-testid="search-form-collapsable-button"
            >
              Buscar
            </Button>
          </Grid>
        </Paper>
      </Collapse>
    </Grid>
  );
}
