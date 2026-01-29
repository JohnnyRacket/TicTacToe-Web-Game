import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GameCell } from './GameCell';

describe('GameCell', () => {
  const defaultProps = {
    position: 'a1' as const,
    value: null,
    isDisabled: false,
    onClick: vi.fn(),
  };

  it('renders an empty cell when value is null', () => {
    render(<GameCell {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('renders X with correct color when value is x', () => {
    render(<GameCell {...defaultProps} value="x" playerXColor="#ff0000" />);
    
    const xElement = screen.getByText('X');
    expect(xElement).toBeInTheDocument();
    expect(xElement).toHaveStyle({ color: '#ff0000' });
  });

  it('renders O with correct color when value is o', () => {
    render(<GameCell {...defaultProps} value="o" playerOColor="#00ff00" />);
    
    const oElement = screen.getByText('O');
    expect(oElement).toBeInTheDocument();
    expect(oElement).toHaveStyle({ color: '#00ff00' });
  });

  it('uses default colors when not provided', () => {
    render(<GameCell {...defaultProps} value="x" />);
    
    const xElement = screen.getByText('X');
    expect(xElement).toHaveStyle({ color: '#3b82f6' }); // default blue
  });

  it('calls onClick with position when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    
    render(<GameCell {...defaultProps} onClick={onClick} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('a1');
  });

  it('is disabled when isDisabled is true', () => {
    render(<GameCell {...defaultProps} isDisabled={true} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when cell already has a value', () => {
    render(<GameCell {...defaultProps} value="x" isDisabled={false} />);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is enabled when empty and not disabled', () => {
    render(<GameCell {...defaultProps} value={null} isDisabled={false} />);
    
    expect(screen.getByRole('button')).toBeEnabled();
  });
});
