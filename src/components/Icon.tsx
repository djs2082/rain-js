import React from 'react';
import { useIconTheme } from '../theme/iconProvider';
import { ICON_MAP, IconKey, ICON_KEYS } from './iconMap';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon key from the collection */
  name: IconKey;
  /** Override size (e.g., '24px' or number) */
  size?: string | number;
  /** Override color */
  color?: string;
}

export function Icon({ name, size, color, ...rest }: IconProps) {
  const theme = useIconTheme();
  const Comp = ICON_MAP[name];
  const resolvedSize = typeof size === 'number' ? `${size}px` : size ?? theme.size;
  const resolvedColor = color ?? theme.color;

  return <Comp size={resolvedSize} color={resolvedColor} {...rest} />;
}

export default Icon;
