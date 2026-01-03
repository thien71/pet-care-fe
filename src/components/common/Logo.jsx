import { FaPaw } from "react-icons/fa";

const Logo = ({ className = "", iconClassName = "", animate = true }) => {
  return (
    <div
      className={`
        inline-block
        p-3
        bg-[#8e2800]
        rounded-full
        mb-4
        ${animate ? "animate-bounce" : ""}
        ${className}
      `}
    >
      <FaPaw
        className={`
          text-white
          text-4xl
          ${iconClassName}
        `}
      />
    </div>
  );
};

export default Logo;
