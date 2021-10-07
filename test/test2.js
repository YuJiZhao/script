let a = () => {
    try {
        a = [1, 2, 3, 4, 5];
        a.forEach((v, i) => {
            if (v > 3) {
                console.log(v, " ", i);
                throw new Error(1);
            }
        });
    } catch (e) {
        return e.message;
    }
    return -1;
}

console.log(a());