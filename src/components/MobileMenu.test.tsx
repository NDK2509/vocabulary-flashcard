import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MobileMenu } from './MobileMenu';

// Mock signOut server action
vi.mock('@/actions/auth', () => ({
  signOut: vi.fn(),
}));

describe('MobileMenu', () => {
  it('renders hamburger toggle button with mobile touch target', () => {
    render(<MobileMenu isAuthenticated={false} />);
    const button = screen.getByRole('button', { name: /Open navigation menu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('min-h-[44px]');
  });

  it('toggles mobile menu dropdown when hamburger button is clicked', () => {
    render(<MobileMenu isAuthenticated={false} />);
    const toggleButton = screen.getByRole('button', { name: /Open navigation menu/i });

    // Menu is closed initially
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /Close navigation menu/i })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();

    // Click to close
    fireEvent.click(screen.getByRole('button', { name: /Close navigation menu/i }));
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  it('renders authenticated links when user is signed in', () => {
    render(
      <MobileMenu isAuthenticated={true} userEmail="test@example.com" />
    );
    fireEvent.click(screen.getByRole('button', { name: /Open navigation menu/i }));

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Flashcards')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeInTheDocument();
  });
});

