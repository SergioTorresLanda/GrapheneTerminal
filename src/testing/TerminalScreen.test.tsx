import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TerminalScreen } from '../screens/TerminalScreen';

// 1. Hack the Matrix (Mocking)
// We tell Jest to intercept our database hook and force it to return an empty array 
// and a 'CONNECTING' status, simulating the exact millisecond the app opens.
jest.mock('../hooks/useOrderBookFromDisk', () => ({
  useOrderBookFromDisk: () => ({ 
    data: [], 
    status: 'CONNECTING' 
  })
}));

//2. We also mock the WebSocket so it doesn't try to connect to the Go API during the test
jest.mock('../services/grapheneSocket', () => ({
  grapheneSocket: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribe: jest.fn(),
  }
}));

// 3. Mock the WatermelonDB Database Instance
// This completely stops Jest from trying to initialize the C++ SQLite adapter
jest.mock('../db', () => ({
  database: {
    get: jest.fn(() => ({
      query: jest.fn(() => ({
        // Return an empty array to simulate an empty database on boot
        fetch: jest.fn().mockResolvedValue([]), 
      })),
    })),
  }
}));

describe('TerminalScreen', () => {
  it('displays the boot sequence UI when establishing uplink', () => {
    // 2. Render the component in memory
    render(<TerminalScreen />);

    // 3. The Assertion
    // We expect to see our exact loading text on the screen
    expect(screen.getByText('ESTABLISHING UPLINK...')).toBeTruthy();
  });
});