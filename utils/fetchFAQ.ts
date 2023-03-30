export const fetchFAQ = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getFAQ`);

  const data = await res.json();
  const faq: FAQ[] = data.faq;
  return faq;
};
