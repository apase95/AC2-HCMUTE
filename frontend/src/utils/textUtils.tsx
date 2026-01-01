export const cleanText = (text: string) => {
    return text.replace(/<[^>]*>?/gm, ''); 
};

export const slugifyFormat = (text: string) => {
    const clean = cleanText(text);
    return clean.toString().toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};