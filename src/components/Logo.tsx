import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "full" | "chip";
  href?: string | null;
  className?: string;
  priority?: boolean;
};

export function Logo({
  variant = "full",
  href = "/",
  className = "",
  priority = false,
}: LogoProps) {
  const image =
    variant === "chip" ? (
      <Image
        src="/brand/chip.png"
        alt="FortuneX"
        width={56}
        height={56}
        priority={priority}
        className="h-10 w-10 object-contain drop-shadow-[0_0_16px_rgba(157,80,255,0.65)] sm:h-12 sm:w-12"
      />
    ) : (
      <Image
        src="/brand/logo.png"
        alt="FortuneX Online Casino"
        width={280}
        height={72}
        priority={priority}
        className="h-9 w-auto object-contain sm:h-11"
      />
    );

  if (href === null) {
    return <span className={className}>{image}</span>;
  }

  return (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      {image}
    </Link>
  );
}
