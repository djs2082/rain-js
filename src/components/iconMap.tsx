import React from 'react';
// Centralized icon map for the Icon component
import { FiHome, FiSearch, FiUser, FiSettings, FiMenu, FiX, FiBell, FiInfo, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { FaGithub, FaTwitter, FaLinkedin, FaCog, FaEnvelope, FaShareAlt } from 'react-icons/fa';
import { MdCheck, MdError, MdWarning } from 'react-icons/md';

export type IconKey =
  | 'home'
  | 'search'
  | 'user'
  | 'settings'
  | 'menu'
  | 'close'
  | 'bell'
  | 'info'
  | 'sun'
  | 'moon'
  | 'logout'
  | 'github'
  | 'twitter'
  | 'linkedin'
  | 'cog'
  | 'email'
  | 'share'
  | 'check'
  | 'error'
  | 'warning';

export const ICON_MAP: Record<IconKey, React.ComponentType<any>> = {
  home: FiHome,
  search: FiSearch,
  user: FiUser,
  settings: FiSettings,
  menu: FiMenu,
  close: FiX,
  bell: FiBell,
  info: FiInfo,
  sun: FiSun,
  moon: FiMoon,
  logout: FiLogOut,
  github: FaGithub,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  cog: FaCog,
  email: FaEnvelope,
  share: FaShareAlt,
  check: MdCheck,
  error: MdError,
  warning: MdWarning,
};

export const ICON_KEYS = Object.keys(ICON_MAP) as IconKey[];
