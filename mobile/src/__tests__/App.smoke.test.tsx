import { render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import App from '../../App';
import { useAuthBootstrap } from '../features/auth/useAuthBootstrap';

jest.mock('../features/auth/useAuthBootstrap', () => ({
  useAuthBootstrap: jest.fn(),
}));

jest.mock('../services/firebase/firebaseAuthActions', () => ({
  signInWithAnonymousAuth: jest.fn(),
  signOutCurrentUser: jest.fn(),
}));

describe('App shell', () => {
  it('renders signed-out state entry point', () => {
    const mockedUseAuthBootstrap = useAuthBootstrap as jest.MockedFunction<typeof useAuthBootstrap>;

    mockedUseAuthBootstrap.mockReturnValue({
      status: 'unauthenticated',
      user: null,
      error: null,
    });

    render(<App />);

    expect(screen.getByText('Bearing')).toBeTruthy();
    expect(screen.getByText('No active session found.')).toBeTruthy();
    expect(screen.getByText('Open Sign-In Entry')).toBeTruthy();
  });
});
