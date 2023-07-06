import React from 'react';
import DefaultError from 'components/DefaultError';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import NewMain from './main';

export const NewError = () => NewMain().mixin({
  title: 'Erro',
  icon: 'error',
});

export function Error(
  content?: string | JSX.Element,
  options: SweetAlertOptions = {},
): Promise<SweetAlertResult<any>> {
  let html = content;
  if (!html || typeof html === 'string') {
    html = <DefaultError message={html} />;
  }
  return NewError().mixin({ ...options, html }).fire();
}
