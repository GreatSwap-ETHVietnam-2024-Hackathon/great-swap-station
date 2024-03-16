export function displayAddress(address: string, startingCharacterNum: number, endingCharacterNum: number) {
    return address.slice(0, startingCharacterNum) + "..." + address.slice(-endingCharacterNum)
}

export function displayName(name: string, startingCharacterNum: number, endingCharacterNum: number) {
    if (name.length <= startingCharacterNum + endingCharacterNum) return name;
    return name.slice(0, startingCharacterNum) + "..." + name.slice(-endingCharacterNum)
}   