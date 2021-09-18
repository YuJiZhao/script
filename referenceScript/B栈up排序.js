let allUp = [];
let pageIndex = 1;
let num = 0;
let putData = () => {
    let onePage = [];
    $('.cover').each((i, item) => {
        let upData = {
            name: $('.fans-name')[i].innerHTML,
            id: item.pathname.replace(/\//g, '')
        }
        let data = $.ajax({
            url: `https://api.bilibili.com/x/relation/stat?vmid=${upData.id}&jsonp=jsonp&callback=__jp3`,
            async: false,
            xhrFields: {
                withCredentials: true
            }
        });
        upData.follower = JSON.parse(data.responseText.replace('__jp3(', '').replace(')', '')).data
            .follower;
        num++
        onePage.push(upData);
        console.log(`%c ☑%c 获取第${num}个up主:${upData.name} 粉丝数量:${upData.follower}`, 'color:green',
            '')
        if (i === $('.cover').length - 1) {
            console.log(`%c ☑%c 第${pageIndex}页up主获取完毕`, 'color:green', 'font-weight:bold');
            allUp.push(onePage);
            if ($('.be-pager-next')[0].classList.length === 1) {
                console.warn('正在进入下一页...');
                pageIndex++;
                $('.be-pager-next').click();
                setTimeout(() => {
                    putData();
                }, 500)
            } else {
                console.log('%c ☑%c 恭喜！已获取全部关注的up', 'color:green;font-size:20px',
                    'font-weight:bold;color:red;font-size:20px');
                let result = [];
                allUp.forEach(item => {
                    result = result.concat(item);
                })
                console.warn('根据up主的粉丝数排序后');
                console.table(result.sort((a, b) => b.follower - a.follower).map(item => {
                    return {
                        'up主': item.name,
                        '粉丝数量': item.follower
                    }
                }))
            }
        }
    })
}
putData();