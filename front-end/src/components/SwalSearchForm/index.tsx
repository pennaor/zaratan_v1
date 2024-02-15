import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { SweetAlert2 } from 'sweetalert2-react-content';

type SwalSearchFormProps = {
  history: any,
  customSwal: SweetAlert2,
};

export default function SwalSearchForm({ history, customSwal }: SwalSearchFormProps) {
  const [blockField, setBlockField] = useState('');
  const [terrainField, setTerrainField] = useState('');

  const onSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault();
    customSwal.close();
    history.push(`/lotes?block=${blockField}&terrain=${terrainField}`);
  };

  return (
    <Grid
      component="form"
      container
      justifyContent="center"
      alignItems="baseline"
      gap={3}
      className="swal-form"
    >
      <TextField
        variant="filled"
        size="small"
        FormHelperTextProps={{ sx: { textAlign: 'center' } }}
        type="text"
        name="block"
        label="Quadra"
        onChange={(ev) => setBlockField(ev.target.value)}
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
      />
      <Grid
        container
        justifyContent="center"
      >
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: '#38c593' }}
          onClick={onSubmit}
          disabled={!blockField.length}
        >
          Buscar
        </Button>
      </Grid>
    </Grid>
  );
}
