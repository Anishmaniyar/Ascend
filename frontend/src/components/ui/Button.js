"use client";

import { forwardRef } from "react";

/**
 * Shared Button component — the single source of truth for all button styles.
 *
 * Variants:
 *   primary   — solid accent (amber/gold), dark text
 *   secondary — transparent + subtle border
 *   ghost     — no border, transparent bg, subtle hover fill
 *   destructive — danger color background
 *
 * Sizes:
 *   sm — 36px height, 13px text
 *   md — 42px height, 15px text  (default)
 *   lg — 46px height, 15px text
 */
const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    render,
    children,
    ...props
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 font-polysans font-medium tracking-[-0.02em] transition-all duration-150 ease-out cursor-pointer rounded-buttons select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-50 disabled:cursor-not-allowed group";

  const sizes = {
    sm: "h-9 px-4 text-13",
    md: "h-[42px] px-5 text-15",
    lg: "h-[46px] px-6 text-15",
  };

  const variants = {
    primary:
      "bg-ember text-inverse hover:opacity-90 active:opacity-80",
    secondary:
      "border border-mist text-graphite bg-transparent hover:bg-ash hover:border-graphite",
    ghost:
      "text-graphite bg-transparent hover:bg-ash",
    destructive:
      "bg-danger text-inverse hover:opacity-90 active:opacity-80",
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (render) {
    const { className: renderClassName, ...renderRest } = render.props;
    return (
      <render.type
        {...renderRest}
        ref={ref}
        className={`${classes} ${renderClassName ?? ""}`}
      >
        {children}
      </render.type>
    );
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
