import React from "react";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * The content of the button
     */
    children?: React.ReactNode;
    /**
     * The variant to use
     */
    variant?: "text" | "outlined" | "contained";
    /**
     * The color of the component
     */
    color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
    /**
     * The size of the component
     */
    size?: "small" | "medium" | "large";
    /**
     * If true, the component is disabled
     */
    disabled?: boolean;
    /**
     * Element placed before the children
     */
    startIcon?: React.ReactNode;
    /**
     * Element placed after the children
     */
    endIcon?: React.ReactNode;
    /**
     * If true, the button will take up the full width of its container
     */
    fullWidth?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
