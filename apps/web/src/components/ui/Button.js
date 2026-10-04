"use client";

import { forwardRef } from "react";

/* Editorial buttons — quiet, 7px radius, no glow.
   primary: solid charcoal / off-white. secondary: hairline border. */
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
    "inline-flex items-center justify-center gap-2 font-inter font-normal transition-all duration-150 ease-out cursor-pointer rounded-buttons select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group";

  const sizes = {
    sm: "h-8 px-3.5 text-[12px] leading-none",
    md: "h-9 px-4 text-[13px] leading-none",
    lg: "h-10 px-5 text-[13px] leading-none",
  };

  const variants = {
    primary: "bg-graphite text-canvas hover:opacity-85 active:opacity-75",
    secondary:
      "border border-mist-strong text-graphite bg-transparent hover:bg-ash",
    ghost: "text-steel bg-transparent hover:bg-ash hover:text-graphite",
    destructive: "bg-danger text-inverse hover:opacity-90",
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
    <button ref={ref} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
});

export default Button;
