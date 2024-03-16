export function isValidTelegramId(telegramId: any) {
    const numericValue = Number(telegramId);
    if (isNaN(numericValue)) return false;
    if (numericValue < 0) return false;
    return true;
}