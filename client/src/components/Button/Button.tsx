// import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

type ButtonProps =
  | {
      as?: 'button';
      type?: 'button' | 'submit' | 'reset';
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
      disabled?: boolean;
      variant?: 'primary' | 'secondary' | 'ghost';
      size?: 'sm' | 'md' | 'lg' | 'square';
      children?: React.ReactNode;
    }
  | {
      as: 'link';
      to: string;
      target?: string;
      rel?: string;
      onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void | Promise<void>;
      variant?: 'primary' | 'secondary' | 'ghost';
      size?: 'sm' | 'md' | 'lg' | 'square';
      children?: React.ReactNode;
    };

export const Button = (props: ButtonProps) => {
  const {
    as = 'button',
    variant = 'primary',
    size = 'md',
    children,
    ...rest
  } = props;

  const className = `${styles.btn} ${styles[`btn--${variant}`]} ${styles[`btn--${size}`]}`;

  if (as === 'link') {
    const { to, target, rel, onClick } = rest as Extract<ButtonProps, { as: 'link' }>;
    return (
      <Link to={to} className={className} target={target} rel={rel} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { type = 'button', disabled, onClick } = rest as Extract<ButtonProps, { as?: 'button' }>;
  return (
    <button type={type} disabled={disabled} className={className} onClick={onClick}>
      {children}
    </button>
  );
};