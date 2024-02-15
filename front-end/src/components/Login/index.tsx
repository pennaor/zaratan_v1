import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import {
  TextField, Container, Button, Box, Grid, AppBar, Toolbar, FormHelperText,
} from '@mui/material';
import customSwal from 'customSwal';
import fetchAPI from '../../utils/fetchAPI';
import Logo from '../Logo';

function Header() {
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <AppBar
        position="static"
        sx={{
          borderRadius: '10px 10px 0px 0px',
          boxShadow: '0 1px 9px 0px #38c593',
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            flexWrap: 'wrap',
            p: 2,
            justifyContent: 'center',
          }}
        >
          <Grid
            container
            spacing={2}
            width={1}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <Logo
              alignItems="center"
            />
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

type LoginProps = {
  redirectUser: boolean;
};

export default function Login({ redirectUser }: LoginProps) {
  const [form, setFormValue] = useState({
    email: '',
    password: '',
  });

  const history = useHistory();

  const onChangeField = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target: { name, value } } = ev;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const onLoginClickButton = async () => {
    fetchAPI<typeof form, { token: string }>('POST', '/user/login', form)
      .then(({ data }) => {
        localStorage.setItem('_zaratan_token', data.token);
        history.go(0);
      })
      .catch(({ response }) => {
        customSwal.Error(response && response.status === 401 ? 'Credenciais inválidas' : undefined);
      });
  };

  return !redirectUser ? (
    <Grid
      width="100vw"
      height="94vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Container
        maxWidth="xs"
        sx={{
          bgcolor: 'white',
          borderRadius: '10px',
          width: '90%',
        }}
        component="main"
        disableGutters
      >
        <Header />
        <Grid
          component="form"
          container
          gap="27px"
          flexDirection="column"
          alignItems="center"
          alignSelf="center"
          mx="auto"
          padding={5}
          sx={{
            border: 1,
            boxShadow: '0 1px 7px 0px #38c593',
            borderRadius: '0px 0px 10px 10px',
            borderWidth: '0px 1px 1px 1px',
            borderStyle: 'solid',
            borderColor: '#38c593',
          }}
        >
          <TextField
            type="email"
            name="email"
            label="E-mail"
            placeholder="Insira seu email"
            value={form.email}
            onChange={onChangeField}
            required
            id="email-input"
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            placeholder="Insira sua senha"
            value={form.password}
            onChange={onChangeField}
            required
            id="password-input"
          />
          <Grid
            container
            item
            flexDirection="column"
            alignItems="center"
            gap={1.5}
          >
            <FormHelperText>
              * Campos obrigatórios
            </FormHelperText>
            <Button
              variant="contained"
              type="button"
              size="large"
              sx={{
                color: 'white',
              }}
              disabled={form.email.length < 2 || form.password.length < 2}
              onClick={onLoginClickButton}
              id="login-button"
            >
              Entrar
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  ) : (
    <Redirect to="/lotes" />
  );
}
