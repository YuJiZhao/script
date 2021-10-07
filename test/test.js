let a = () => {
    a = [1, 2, 3, 4, 5];
    a.forEach(v => {
        console.log(v);
        if(v > 3) {
            console.log("结束遍历");
            return 1;
        }
    });
    return -1;
}

console.log(a());