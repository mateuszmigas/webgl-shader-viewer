export const remove = <T>(array: T[], item: T) => {
    const index = array.indexOf(item);

    if (index > -1) {
        array.splice(index, 1);
    }
};