import React, { useState, useEffect } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debounced;
}

const getColorStyles = (color, variant) => {
    const colors = {
        primary: { main: "#1976d2", hover: "#1565c0", text: "#1976d2" },
        secondary: { main: "#9c27b0", hover: "#7b1fa2", text: "#9c27b0" },
        success: { main: "#2e7d32", hover: "#1b5e20", text: "#2e7d32" },
        error: { main: "#d32f2f", hover: "#c62828", text: "#d32f2f" },
        warning: { main: "#ed6c02", hover: "#e65100", text: "#ed6c02" },
        info: { main: "#0288d1", hover: "#0277bd", text: "#0288d1" }
    };
    const colorConfig = colors[color || "primary"];
    switch (variant) {
        case "contained":
            return {
                backgroundColor: colorConfig.main,
                color: "#fff",
                borderColor: colorConfig.main,
                "&:hover": {
                    backgroundColor: colorConfig.hover,
                    borderColor: colorConfig.hover
                }
            };
        case "outlined":
            return {
                backgroundColor: "transparent",
                color: colorConfig.text,
                borderColor: colorConfig.text,
                "&:hover": {
                    backgroundColor: `${colorConfig.text}08`,
                    borderColor: colorConfig.text
                }
            };
        case "text":
        default:
            return {
                backgroundColor: "transparent",
                color: colorConfig.text,
                borderColor: "transparent",
                "&:hover": {
                    backgroundColor: `${colorConfig.text}08`
                }
            };
    }
};
const getSizeStyles = (size) => {
    switch (size) {
        case "small":
            return {
                padding: "4px 10px",
                fontSize: "0.8125rem",
                minHeight: "30px"
            };
        case "large":
            return {
                padding: "8px 22px",
                fontSize: "0.9375rem",
                minHeight: "42px"
            };
        case "medium":
        default:
            return {
                padding: "6px 16px",
                fontSize: "0.875rem",
                minHeight: "36px"
            };
    }
};
const Button = React.forwardRef(function Button({ children, variant = "text", color = "primary", size = "medium", disabled = false, startIcon, endIcon, fullWidth = false, style, className, ...rest }, ref) {
    const colorStyles = getColorStyles(color, variant);
    const sizeStyles = getSizeStyles(size);
    const baseStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: "0.02857em",
        textTransform: "uppercase",
        border: "1px solid",
        borderRadius: "4px",
        cursor: disabled ? "default" : "pointer",
        transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        width: fullWidth ? "100%" : "auto",
        boxSizing: "border-box",
        outline: "none",
        textDecoration: "none",
        opacity: disabled ? 0.6 : 1,
        ...sizeStyles,
        ...colorStyles,
        ...style
    };
    const handleMouseEnter = (e) => {
        if (!disabled) {
            const hoverStyles = colorStyles["&:hover"];
            if (hoverStyles) {
                Object.assign(e.currentTarget.style, hoverStyles);
            }
        }
    };
    const handleMouseLeave = (e) => {
        if (!disabled) {
            e.currentTarget.style.backgroundColor = colorStyles.backgroundColor || "";
            e.currentTarget.style.borderColor = colorStyles.borderColor || "";
        }
    };
    return (jsxs("button", { ref: ref, style: baseStyles, className: className, disabled: disabled, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, ...rest, children: [startIcon && jsx("span", { style: { display: "flex", marginLeft: "-4px", marginRight: "8px" }, children: startIcon }), children, endIcon && jsx("span", { style: { display: "flex", marginRight: "-4px", marginLeft: "8px" }, children: endIcon })] }));
});

export { Button, useDebounce };
//# sourceMappingURL=index.js.map
