import { fireEvent, render, screen } from '@testing-library/react-native';
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

  it('renders authenticated users into the tab shell and switches tabs', () => {
    const mockedUseAuthBootstrap = useAuthBootstrap as jest.MockedFunction<typeof useAuthBootstrap>;

    mockedUseAuthBootstrap.mockReturnValue({
      status: 'authenticated',
      user: { uid: 'user-123' } as never,
      error: null,
    });

    render(<App />);

    expect(screen.getByText('Plan your schedule and launch Focus Mode from here.')).toBeTruthy();
    expect(screen.getAllByText('Calendar').length).toBeGreaterThan(0);
    expect(screen.getByText('Goals')).toBeTruthy();
    expect(screen.getByText('Notes')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();

    fireEvent.press(screen.getByText('Goals'));
    expect(screen.getByText('Track long-term goals, milestones, and the next step to execute.')).toBeTruthy();

    fireEvent.press(screen.getByText('Notes'));
    expect(screen.getByText('Capture quick thoughts, Idea Dump entries, and longer-form notes.')).toBeTruthy();

    fireEvent.press(screen.getByText('Profile'));
    expect(screen.getByText('Manage account settings, premium access, and future calendar connections.')).toBeTruthy();
    expect(screen.getByText('Sign Out')).toBeTruthy();
  });
});
