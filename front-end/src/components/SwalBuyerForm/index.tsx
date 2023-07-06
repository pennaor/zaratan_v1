import React, { useState } from 'react';
import { AxiosError } from 'axios';
import {
  Box, Typography, Button,
} from '@mui/material';
import { SweetAlert2 } from 'sweetalert2-react-content';
import fetchAPI from 'utils/fetchAPI';
import customSwal from 'customSwal';
import {
  IBuyerForm, ReportedBuyer, makeBuyerForm, newReportedBuyer,
} from 'types/buyers';
import BuyerForm from '../BuyerForm';

interface SwalBuyerFormProps {
  reportedBuyer: ReportedBuyer;
  saleId: number;
  swal: SweetAlert2;
  index?: number;
  buyerHandler: (reportedBuyer: ReportedBuyer, index?: number) => void;
}

export default function SwalBuyerForm(props: SwalBuyerFormProps) {
  const {
    saleId,
    buyerHandler,
    reportedBuyer,
    swal,
    index,
  } = props;

  const [buyer, setBuyer] = useState<ReportedBuyer>(reportedBuyer);

  const onChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = ev.target.name as keyof IBuyerForm;
    setBuyer((prev) => ({ ...prev, [name]: ev.target.value }));
  };

  const onSend = async () => {
    try {
      await fetchAPI<IBuyerForm[]>('POST', '/buyer/report', [buyer]);
      await customSwal
        .Success(
          'As alterações do comprador foram aplicadas na lista de compradores da venda. Para efetiva-las, é necessário finalizar a operação ativa',
          { toast: true },
        );
      buyerHandler({ ...buyer, report: makeBuyerForm() }, index);
    } catch (err) {
      const { response } = (err as AxiosError<IBuyerForm[]>);
      if (!response || (response.status !== 409 && response.status !== 422)) {
        return await customSwal.Error();
      }
      if (typeof response.data === 'string') {
        await customSwal.Error(response.data);
        return await swal.fire({
          html: (
            <SwalBuyerForm
              saleId={saleId}
              buyerHandler={buyerHandler}
              reportedBuyer={newReportedBuyer(buyer)}
              index={index}
              swal={swal}
            />
          ),
        });
      }
      return setBuyer((prev) => ({ ...prev, report: response.data[0] }));
    }
  };

  return (
    <Box className="edit-buyer-form">
      <Typography
        variant="h5"
        component="div"
        padding="0.25em 0 0.85em"
      >
        Editar comprador
      </Typography>

      <BuyerForm
        buyer={buyer}
        index={index}
        onChange={onChange}
      />

      <Box className="actions">
        <Button
          className="btn"
          type="button"
          onClick={onSend}
        >
          Enviar
        </Button>
        <Button
          className="btn cancel"
          type="button"
          onClick={() => swal.close()}
        >
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
