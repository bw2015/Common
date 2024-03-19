!function () {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = `
    #saveResult{
        background-color:#fff;
        color:#000;
        border:1px solid #333;
        bottom:0;
        top:inherit !important;
        }`;
    document.head.appendChild(style);
}();
let timeIndex = 0;
let tabIndex = 0;
setInterval(() => {
    timeIndex++;
    // 跳转到历史记录页面
    //const btnRecord = document.body.querySelector(".navigation_records__3Eh7P");
    //const countdown = document.body.querySelector(".countdown_time__heEcw");
    //if (btnRecord && countdown) {
    //    const countdownTime = countdown.innerText;
    //    if (["00:30", "00:31"].includes(countdownTime)) {
    //        btnRecord.click();
    //        return;
    //    }
    //}

    // 读取历史记录
    if (location.hash === "#records") {
        let tip = document.getElementById("debug-tip");
        if (!tip) {
            tip = document.createElement("div");
            tip.setAttribute("style", `
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, .5);
            color: #fff !important;
            font-size: 98px;
            font-weight:800;
            text-align:center;
            line-height:320px;
            min-height:320px;
            z-index: 999999999;
            `)
            tip.setAttribute("id", "debug-tip");
            document.body.appendChild(tip);
        }
        tip.innerHTML = timeIndex.toString();
        // 30秒切换一次
        if (timeIndex % 30 === 0) {
            try {
                const tab = document.body.querySelector(".tabs_main__1CpCa"),
                    tabs = [];

                if (tab) {
                    const active = tab.querySelector(".tabs_active__3tkcS") && "record" || "bet";
                    tab.querySelectorAll("p").forEach(p => {
                        switch (p.innerText) {
                            case "探险日志":
                                tabs[0] = p;
                                break;
                            case "派遣记录":
                                tabs[1] = p;
                                break;
                        }
                    });
                    if (tabs.length === 2) {
                        tabs[tabIndex % 2].click();
                    }
                } else {
                    tip.innerHTML = "tab未找到";
                }
            } catch (ex) {
                tip.innerHTML = ex;
            } finally {
                tabIndex++;
            }
        }
        const records = [];
        document.body
            .querySelectorAll(".report_content__3PD7_").forEach((elem) => {
                const starElem = elem.querySelector(".report_title__2EtMW");
                const timeElem = elem.querySelector(".report_time__17927");
                if (starElem && timeElem) {
                    records.push({
                        star: starElem.innerText,
                        time: timeElem.innerText,
                    });
                }
            });
        if (records.length) {
            window["saveResult"] && window["saveResult"](records, "YK.Galaxy.Records");
        }
        return;
    }

    // 从开奖弹出窗上读取当前期的内容
    const elem = document.body.querySelector(".result_resultTitle__2V324");
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