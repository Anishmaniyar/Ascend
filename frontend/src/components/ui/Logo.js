import Image from "next/image";

export default function Logo({ className = "h-7 w-7" }) {
  return (
    <Image
      src="/706a1d4d-a997-40cf-a796-c0402313ded6.png"
      alt="LeetAptitude logo"
      className={className}
      width={28}
      height={28}
      aria-hidden="true"
    />
  );
}
