type AccountAvatarProps = {
  name: string | null;
  email: string | null;
};

export function AccountAvatar({ name, email }: AccountAvatarProps) {
  const source = name?.trim() || email || "A";
  const initials = source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-blush text-xl font-semibold text-brand-brown sm:h-24 sm:w-24 sm:text-2xl"
      aria-hidden
    >
      {initials || "SD"}
    </div>
  );
}
