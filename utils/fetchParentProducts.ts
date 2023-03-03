export const fetchParentProducts = async () => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getParentProducts`
    );

    const data = await res.json()
    const parentProducts: ParentProduct[] = data.parentProducts;
    return parentProducts;
}