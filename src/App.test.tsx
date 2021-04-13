import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders realm element', () => {
  render(<App />);
  const realmElement = screen.getByText(/Realm Configuration/i);
  expect(realmElement).toBeInTheDocument();
});
