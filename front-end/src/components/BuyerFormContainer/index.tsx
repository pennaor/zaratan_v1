import React from 'react';
import {
  Grid, Typography,
} from '@mui/material';
import EditButton from 'components/EditButton';
import SortButton from 'components/SortButton';
import {
  ReportedBuyer,
} from 'types/buyers';
import RemoveButton from 'components/RemoveButton';
import BuyerForm from '../BuyerForm';

interface BuyerFormContainerProps {
  buyer: ReportedBuyer;
  focusedRef: React.MutableRefObject<HTMLDivElement | null> | null;
  index: number;
  onEdit?: () => void;
  onRemove: () => void;
  onSort: () => void;
  onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => void
}

export default function BuyerFormContainer(props: BuyerFormContainerProps) {
  const {
    buyer, focusedRef, index,
    onRemove, onSort, onEdit, onChange,
  } = props;

  return (
    <Grid
      id={buyer.tmpId}
      ref={focusedRef}
      container
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      paddingX={2}
      paddingY={3}
      gap={2}
      tabIndex={0}
      data-testid={`${index}-buyer-content`}
    >
      <Grid
        container
        flexDirection="row"
        alignItems="center"
        justifyContent="space-evenly"
        paddingBottom={1}
      >
        <Grid
          container
          item
          flexBasis="33%"
        />
        <Grid
          container
          item
          flexBasis="33%"
          justifyContent="center"
        >
          <Typography
            variant="h6"
            component="span"
          >
            {`#${index + 1}`}
          </Typography>
          <RemoveButton
            onRemove={onRemove}
            testId="remove-buyer-button"
          />
        </Grid>
        <Grid
          container
          item
          flexBasis="33%"
          justifyContent="end"
          gap={0.2}
        >
          {onEdit && (
            <EditButton
              onEdit={onEdit}
            />
          )}
          <SortButton
            onSort={onSort}
            testId="sort-buyers-button"
          />
        </Grid>
      </Grid>
      <BuyerForm
        buyer={buyer}
        index={index}
        onChange={onChange}
        disableFields={!!buyer.id}
      />
    </Grid>
  );
}
