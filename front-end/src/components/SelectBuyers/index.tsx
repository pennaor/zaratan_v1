import React, { useEffect, useState } from 'react';
import { useFetch } from 'hooks/useFetch';
import Loading from 'components/Loading';
import {
  Box,
  IconButton,
  FilledInput,
  ListItemText,
  Typography,
  Alert,
  Chip,
  Checkbox,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import './select-buyers.css';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Buyer } from 'types/Terrain';
import {
  IBuyerForm,
  ReportedBuyer,
  newReportedBuyer,
  sortByFullName,
} from 'types/buyers';
import { stringfyArrayObjectsValues } from 'utils/stringfyObjectValues';
import customSwal from 'customSwal';

function resolveBuyerOption({ cpf, cnpj, fullName }: IBuyerForm): string {
  const firstName = fullName.split(' ')[0];
  let abbreviation = firstName.slice(0, 7);
  if (firstName.length > 7) {
    abbreviation += '.';
  }

  return `${abbreviation} | ${cpf || cnpj}`;
}

interface SelectBuyersProps {
  hideBuyers?: IBuyerForm[]
  onCheckoutHandler: (buyers: ReportedBuyer[]) => void;
}

export default function SelectBuyers(props: SelectBuyersProps) {
  const {
    hideBuyers,
    onCheckoutHandler,
  } = props;

  const [buyers, setBuyers] = useState<IBuyerForm[]>();

  const [selection, setSelection] = useState<string[]>([]);

  const {
    response,
    error,
    setFetchParams,
  } = useFetch<Buyer[]>();

  const handleChange = (ev: SelectChangeEvent<typeof selection>) => {
    const options = typeof ev.target.value === 'string' ? ev.target.value.split(',') : ev.target.value;
    setSelection(options.sort());
  };

  const onCheckout = async () => {
    if (!buyers) return;
    const newReportedBuyers: ReportedBuyer[] = [];
    buyers.forEach((buyer, index) => {
      if (selection.includes(resolveBuyerOption(buyer))) {
        newReportedBuyers.push(newReportedBuyer(buyer, index));
      }
    });
    onCheckoutHandler(newReportedBuyers);
    customSwal.Destroy();
  };

  useEffect(() => {
    setFetchParams({ method: 'GET', url: '/buyer' });
  }, [setFetchParams]);

  useEffect(() => {
    if (!response) return;

    let incomingBuyers = stringfyArrayObjectsValues<IBuyerForm>(response.data);
    if (hideBuyers) {
      incomingBuyers = incomingBuyers
        .filter((buyer) => !hideBuyers.some((hideBuyer) => buyer.id === hideBuyer.id));
    }

    setBuyers(sortByFullName(incomingBuyers));
  }, [response, hideBuyers, setFetchParams]);

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ justifyContent: 'center', marginTop: '30px' }}
      >
        Algo falhou
      </Alert>
    );
  }

  if (!buyers) {
    return (
      <Box>
        <Typography className="title">
          Um momento
        </Typography>
        <Loading height="143.5px" />
      </Box>
    );
  }

  if (!buyers.length) {
    return (
      <Alert
        severity="info"
        sx={{ justifyContent: 'center', marginTop: '30px' }}
      >
        Nenhum comprador encontrado
      </Alert>
    );
  }

  return (
    <Box data-testid="select-buyers-content">
      <Typography className="title">
        Adicionar
      </Typography>
      <FormControl variant="filled" sx={{ alignItems: 'center' }}>
        <InputLabel
          id="select-buyers-label"
          data-testid="select-buyers-label"
        >
          Compradores
        </InputLabel>
        <Select
          labelId="select-buyers-label"
          id="select-buyers"
          multiple
          value={selection}
          onChange={handleChange}
          input={<FilledInput data-testid="select-buyers-input" />}
          sx={{ width: '100%' }}
          className="select-buyers"
          MenuProps={{
            PaperProps: {
              className: 'select-buyers-menu',
              // @ts-ignore
              'data-testid': 'select-buyers-menu',
            },
          }}
          renderValue={(options) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: 0.5,
              }}
            >
              {options.map((fullName) => (
                <Chip
                  key={fullName + Date.now()}
                  label={fullName}
                />
              ))}
            </Box>
          )}
        >
          {buyers.map((buyer) => {
            const value = resolveBuyerOption(buyer);
            return (
              <MenuItem
                key={value}
                value={value}
                className="select-buyers-menu-li"
                id={value}
              >
                <Checkbox checked={selection.indexOf(value) > -1} />
                <ListItemText primary={value} />
              </MenuItem>
            );
          })}
        </Select>
        <IconButton
          onClick={() => onCheckout()}
          className="select-buyers-done-button"
          data-testid="select-buyers-done-button"
          sx={{
            fontSize: '50px',
            margin: 0,
            mr: '6px',
            padding: '16px 16px 8px',
            cursor: 'pointer',
            width: 'fit-content',
          }}
        >
          <DoneOutlineIcon fontSize="inherit" />
        </IconButton>
      </FormControl>
    </Box>
  );
}
