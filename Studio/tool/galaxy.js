!function () {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = `
    #saveResult{
        background-color:#fff;
        color:#000;
        border:1px solid #333;
        }`;
    document.head.appendChild(style);
}();
setInterval(() => {
    const elem = document.body.querySelector(".result_resultTitle__2V324");
    if (!elem) {
        const btnLogs = document.body.querySelector(".navigation_records__3Eh7P");
        if (btnLogs) {
            //btnLogs.click();
        }
        return;
    }
    const btn = document.body.querySelector(".result_btn__1RnHr");
    if (btn) {
        if (btn.classList.contains("result_btn_active__2ltlq")) {
            btn.click();
        }
    }
    window["saveResult"] &&
        window["saveResult"]({
            time: Date.now(),
            content: elem.innerText
        }, "YK.Galaxy");
}, 1000);