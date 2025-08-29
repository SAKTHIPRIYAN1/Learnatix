"use client";

import React, { forwardRef } from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  title?: string;
};

const IconLock = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, title = "Lock Icon", className, ...props }, ref) => {
    const ariaHidden = title ? undefined : true;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        role={title ? "img" : undefined}
        aria-hidden={ariaHidden}
        aria-label={title}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />
      </svg>
    );
  }
);

IconLock.displayName = "IconLock";

export default IconLock;

export const IconGraph = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 20, title = "Graph Icon", className, ...props }, ref) => {
    const ariaHidden = title ? undefined : true;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        role={title ? "img" : undefined}
        aria-hidden={ariaHidden}
        aria-label={title}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d="M256 144C256 117.5 277.5 96 304 96L336 96C362.5 96 384 117.5 384 144L384 496C384 522.5 362.5 544 336 544L304 544C277.5 544 256 522.5 256 496L256 144zM64 336C64 309.5 85.5 288 112 288L144 288C170.5 288 192 309.5 192 336L192 496C192 522.5 170.5 544 144 544L112 544C85.5 544 64 522.5 64 496L64 336zM496 160L528 160C554.5 160 576 181.5 576 208L576 496C576 522.5 554.5 544 528 544L496 544C469.5 544 448 522.5 448 496L448 208C448 181.5 469.5 160 496 160z" />
      </svg>
    );
  }
);

IconGraph.displayName = "IconGraph";

export const IconBell = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 20, title = "Bell Icon", className, ...props }, ref) => {
    const ariaHidden = title ? undefined : true;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        role={title ? "img" : undefined}
        aria-hidden={ariaHidden}
        aria-label={title}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z" />
      </svg>
    );
  }
);

IconBell.displayName = "IconBell";

export const IconStudent = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 20, title = "Student Icon", className, ...props }, ref) => {
    const ariaHidden = title ? undefined : true;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        role={title ? "img" : undefined}
        aria-hidden={ariaHidden}
        aria-label={title}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d="M80 259.8L289.2 345.9C299 349.9 309.4 352 320 352C330.6 352 341 349.9 350.8 345.9L593.2 246.1C602.2 242.4 608 233.7 608 224C608 214.3 602.2 205.6 593.2 201.9L350.8 102.1C341 98.1 330.6 96 320 96C309.4 96 299 98.1 289.2 102.1L46.8 201.9C37.8 205.6 32 214.3 32 224L32 520C32 533.3 42.7 544 56 544C69.3 544 80 533.3 80 520L80 259.8zM128 331.5L128 448C128 501 214 544 320 544C426 544 512 501 512 448L512 331.4L369.1 390.3C353.5 396.7 336.9 400 320 400C303.1 400 286.5 396.7 270.9 390.3L128 331.4z" />
      </svg>
    );
  }
);

IconStudent.displayName = "IconStudent";

export const IconSettings = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 18, title = "Settings Icon", className, ...props }, ref) => {
    const ariaHidden = title ? undefined : true;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        role={title ? "img" : undefined}
        aria-hidden={ariaHidden}
        aria-label={title}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z" />
      </svg>
    );
  }
);

IconSettings.displayName = "IconSettings";

