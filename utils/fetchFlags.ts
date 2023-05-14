export const fetchFlags = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/flags`);

  const data = await res.json();
  const flags: Flag[] = data.flags;
  return flags;
};
