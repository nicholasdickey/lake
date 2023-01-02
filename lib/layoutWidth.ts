
const getLayoutWidth = (width: number) => {
    if (width < 900)
        width = 750;
    else if (width > 900 && width < 1200)
        width = 900;
    else if (width >= 1200 && width < 1800)
        width = 1200;
    else if (width >= 1800 && width < 2100)
        width = 1800
    else width = 2100;
    return width;
}
export default getLayoutWidth;