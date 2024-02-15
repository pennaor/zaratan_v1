import React from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface SelectBuyersResultProps {
  success: string[];
  fail: string[];
}

export default function SelectBuyersResult({ success, fail }: SelectBuyersResultProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>OK?</TableCell>
          <TableCell align="justify">Comprador</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fail.map((buyer) => {
          const [name, register] = buyer.split('|');
          return (
            <TableRow
              key={buyer}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <HighlightOffIcon color="error" />
              </TableCell>
              <TableCell align="justify">
                <Typography noWrap minWidth="130px" width="30vw" maxWidth="275px">
                  {name}
                </Typography>
                <Typography minWidth="130px" maxWidth="275px">
                  {register}
                </Typography>
              </TableCell>
            </TableRow>
          );
        })}
        {success.map((buyer) => {
          const [name, register] = buyer.split('|');
          return (
            <TableRow
              key={buyer}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <CheckCircleOutlineIcon color="success" />
              </TableCell>
              <TableCell align="justify">
                <Typography noWrap minWidth="130px" width="30vw" maxWidth="275px">
                  {name}
                </Typography>
                <Typography minWidth="130px" maxWidth="275px">
                  {register}
                </Typography>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
