import React, { useEffect } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  IconButton, Stack, Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Warn } from 'customSwal/warn';
import customSwal from 'customSwal';
import TerrainDataSection from '../TerrainDataSection';
import { useFetch } from '../../hooks/useFetch';
import TerrainDataRow from '../TerrainDataRow';

interface BlockAndNumberProps {
  block: number;
  number: number;
}

function BlockAndNumber({ block, number }: BlockAndNumberProps) {
  return (
    <>
      <TerrainDataRow
        keyField="Quadra"
        valueField={block}
      />
      <TerrainDataRow
        keyField="Lote"
        valueField={number}
      />
    </>
  );
}

interface BodyAlertProps extends BlockAndNumberProps {
  text: string;
}

function BodyAlert(props: BodyAlertProps) {
  const {
    block, number, text,
  } = props;

  return (
    <>
      <Typography
        paddingBottom={2}
      >
        { text }
      </Typography>
      <BlockAndNumber
        block={block}
        number={number}
      />
    </>
  );
}

interface TerrainId { id: number }

type TerrainIdentifiers = TerrainId & BlockAndNumberProps;

function DeleteTerrainButton({ id, block, number } : TerrainIdentifiers) {
  const {
    response,
    error,
    setFetchParams,
  } = useFetch();

  const history = useHistory();

  useEffect(() => {
    if (!error) return;

    customSwal.Error(
      <BodyAlert
        text="Falha ao remover:"
        block={block}
        number={number}
      />,
    );
  }, [error, number, block]);

  useEffect(() => {
    if (!response) return;

    customSwal.Success(
      <BodyAlert
        text="O seguinte lote foi deletado:"
        block={block}
        number={number}
      />,
    )
      .then(() => history.replace('/'));
  }, [response, id, block, number, history]);

  const onClickDeleteButton = async () => {
    let result = await Warn(
      <BodyAlert
        text="Você está prestes da deletar:"
        block={block}
        number={number}
      />,
      {
        confirmButtonText: 'Prosseguir',
        cancelButtonText: 'Cancelar',
      },
    );

    if (result.isDismissed) return;

    result = await Warn('Essa ação é irreversível', { title: 'Tem certeza?' });

    if (result.isDismissed) return;

    setFetchParams({
      method: 'DELETE',
      url: `/terrain/${id}`,
    });
  };

  return (
    <IconButton
      onClick={onClickDeleteButton}
      sx={{ padding: 0 }}
      data-testid="delete-terrain-button-viewer"
    >
      <DeleteForeverIcon color="error" />
    </IconButton>
  );
}

function EditTerrainButton({ id } : TerrainId) {
  const history = useHistory();

  return (
    <IconButton
      sx={{ padding: 0 }}
      onClick={() => history.push(`/lote/editar/${id}`)}
      data-testid="edit-terrain-button-viewer"
    >
      <BorderColorIcon color="primary" />
    </IconButton>
  );
}

export default function TerrainActionsSection({ id, block, number }: TerrainIdentifiers) {
  return (
    <TerrainDataSection
      title="Ações"
      contentHeight="fit-content"
      className="terrain-actions"
    >
      <Stack
        direction="row"
        justifyContent="start"
        gap={6}
        paddingLeft={2}
        paddingRight={1}
        marginY={2}
      >
        <EditTerrainButton
          id={id}
        />
        <DeleteTerrainButton
          id={id}
          block={block}
          number={number}
        />
      </Stack>
    </TerrainDataSection>
  );
}
