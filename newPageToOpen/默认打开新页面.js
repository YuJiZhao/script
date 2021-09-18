// 默认将a标签的target改为blank
$('a').attr('target', '_blank');

document.onkeydown = (e) => {
    e = event || window.event;
    // 按ctrl键时target改回self
    if (e && e.ctrlKey) {
        $('a').mousedown(() => {
            this.attr('target', 'self');
        });
    }

    // 松开ctrl键时仍新建页面打开
    $('a').mouseup(() => {
        this.attr('target', '_blank');
    });
}