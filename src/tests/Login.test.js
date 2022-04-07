import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './renderWithRouter';
import App from '../App';

const EMAIL_TEST_ID = 'email-input';
const PASSWORD_TEST_ID = 'password-input';
const BUTTON_TEST_ID = 'login-submit-btn';

describe('Testando a página de Login', () => {
  let history = {};

  beforeEach(() => {
    history = renderWithRouter(<App />).history;
  });

  test('Testando se a rota está correta', () => {
    const { location: { pathname } } = history;
    expect(pathname).toBe('/');
  });

  test('verificar se o input "Email" existe', () => {
    const inputValueEmail = screen.getByTestId(EMAIL_TEST_ID);
    expect(inputValueEmail).toBeInTheDocument();
  });

  test('verificar se o input "Password" existe', () => {
    const inputValuePassWord = screen.getByTestId(PASSWORD_TEST_ID);
    expect(inputValuePassWord).toBeInTheDocument();
  });

  test('verificar se o botão existe', () => {
    const ButtonClick = screen.getByTestId('login-submit-btn');
    expect(ButtonClick).toBeInTheDocument();
  });

  test('verificar se o botão está desabilitado, corretamente', () => {
    const inputValueEmail = screen.getByTestId(EMAIL_TEST_ID);
    const inputValuePassWord = screen.getByTestId(PASSWORD_TEST_ID);
    const ButtonClick = screen.getByTestId(BUTTON_TEST_ID);

    userEvent.type(inputValueEmail, 'Trybe012testegmail.com');
    userEvent.type(inputValuePassWord, '1234567');

    expect(ButtonClick.closest('button')).toBeDisabled();
  });

  test('verificar se o botão está habilitado, corretamente', () => {
    const inputValueEmail = screen.getByTestId(EMAIL_TEST_ID);
    const inputValuePassWord = screen.getByTestId(PASSWORD_TEST_ID);
    const ButtonClick = screen.getByTestId(BUTTON_TEST_ID);

    userEvent.type(inputValueEmail, 'Trybe012teste@gmail.com');
    userEvent.type(inputValuePassWord, '1234567');

    expect(ButtonClick.closest('button')).not.toBeDisabled();
  });

  test('verificar se é redirecionado para a página de "Comidas"', () => {
    const inputValueEmail = screen.getByTestId(EMAIL_TEST_ID);
    const inputValuePassWord = screen.getByTestId(PASSWORD_TEST_ID);
    const ButtonClick = screen.getByTestId(BUTTON_TEST_ID);

    userEvent.type(inputValueEmail, 'Trybe012teste@gmail.com');
    userEvent.type(inputValuePassWord, '1234567');
    userEvent.click(ButtonClick);

    const textFood = screen.getByRole('heading', {
      name: /comidas/i,
      level: 1,
    });

    expect(textFood).toBeInTheDocument();
  });

  test('Testando se as informações ficam salvas no Local Storage', () => {
    expect(window.location.pathname).toEqual('/comidas');
    expect(localStorage.getItem('user')).toBe('{"email":"Trybe012teste@gmail.com"}');
    expect(localStorage.getItem('mealsToken')).toEqual('1');
    expect(localStorage.getItem('cocktailsToken')).toEqual('1');
  });
});
