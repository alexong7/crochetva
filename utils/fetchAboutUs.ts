export const fetchAboutUs = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/aboutUs`
    );

    const data = await res.json()
    const aboutUs: AboutUs[] = data.aboutUs;
    return aboutUs;
}