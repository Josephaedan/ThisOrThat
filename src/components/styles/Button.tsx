import clsx from "clsx";
import { m, LazyMotion, domMax } from "framer-motion";

interface ButtonProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  className?: string;
  onClick?: () => void;
  props?: React.HTMLProps<HTMLButtonElement>;
}

export default function Button({
  children,
  className,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <LazyMotion features={domMax}>
      <div className="bg-black">
        <m.button
          style={{
            translateX: -2,
            translateY: -2,
          }}
          whileHover={{
            transition: { duration: 0.2 },
            translateX: -5,
            translateY: -5,
          }}
          whileTap={{
            transition: { duration: 0.1 },
            translateX: 0,
            translateY: 0,
          }}
          className={clsx(
            "text-md h-8 w-full border border-neutral bg-white font-bold text-neutral",
            className
          )}
          onClick={onClick}
          {...props}
        >
          {children}
        </m.button>
      </div>
    </LazyMotion>
  );
}
