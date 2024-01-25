import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders initial faucet page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Get your SampleCoins/i);
  expect(linkElement).toBeInTheDocument();
});
