import React, { useEffect } from 'react';
import { usePriorityBadgeTheme } from '../theme/priority/provider';
import type { Priority } from '../theme/priority/types';

export type PriorityBadgeProps = {
	priority: Priority;
	className?: string;
	style?: React.CSSProperties;
	label?: string; // optional custom label; defaults to capitalized priority
	showDot?: boolean; // if true, show a small dot at the start
	blinkDot?: boolean; // if true, make the dot blink
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className, style, label, showDot, blinkDot }) => {
	const theme = usePriorityBadgeTheme();
	const v = theme.variants[priority];
	const text = label ?? capitalize(priority);

	useEffect(() => {
		if (!blinkDot) return;
		const styleId = 'priority-badge-dot-blink-style';
		if (!document.getElementById(styleId)) {
			const s = document.createElement('style');
			s.id = styleId;
			s.textContent = `@keyframes priorityBadgeBlink {0%,100%{opacity:1}50%{opacity:${theme.dot.opacity}}}`;
			document.head.appendChild(s);
		}
	}, [blinkDot, theme.dot.opacity]);

	const baseStyle: React.CSSProperties = {
		display: 'inline-flex',
		alignItems: 'center',
		padding: theme.badge.padding,
		borderRadius: theme.badge.borderRadius,
		fontSize: theme.badge.fontSize,
		fontWeight: theme.badge.fontWeight,
		color: v.color,
		background: v.background,
		flexShrink: 0,
		lineHeight: 1.2,
		gap: theme.badge.gap as any,
	};

	const dotStyle: React.CSSProperties = {
		width: theme.dot.size,
		height: theme.dot.size,
		borderRadius: '50%',
		backgroundColor: v.dotColor ?? `rgba(255,255,255,${theme.dot.opacity})`
	};

	return (
		<span
			className={['priority-badge', className].filter(Boolean).join(' ')}
			style={{ ...baseStyle, ...style }}
			aria-label={`Priority: ${text}`}
			title={`Priority: ${text}`}
		>
			{showDot && (
				<span
					aria-hidden="true"
					style={{
						...dotStyle,
						animation: blinkDot ? `priorityBadgeBlink ${theme.dot.blinkDurationMs}ms ease-in-out infinite` : undefined,
					}}
				/>
			)}
			{text}
		</span>
	);
};

PriorityBadge;

