import React from 'react';
import { IconButton } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useHistory } from 'react-router-dom';
import customSwal from 'customSwal';
import SwalSearchForm from '../SwalSearchForm';

export default function SearchButton() {
  const history = useHistory();

  return (
    <IconButton
      sx={{
        color: 'white',
        fontSize: '30px',
      }}
      onClick={() => {
        const form = customSwal.NewForm();
        form.fire({
          titleText: 'Busca',
          confirmButtonText: 'Buscar',
          showCloseButton: true,
          html: <SwalSearchForm history={history} customSwal={form} />,
        });
      }}
    >
      <TravelExploreIcon
        color="inherit"
        fontSize="inherit"
      />
    </IconButton>
  );
}
