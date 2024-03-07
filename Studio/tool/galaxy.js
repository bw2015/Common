const saveResult = (data) => {
    fetch("https://api.a8.to/Common/API_SaveData?key=YK.Galaxy", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "content=" + JSON.stringify(data),
    });
};
!function () {
    const textarea = document.createElement("textarea");
    textarea.setAttribute(
        "style",
        `position: absolute;
        width:100%;
 left: 0;
 right: 0;
 bottom: 0px;
 z-index: 9999;
 font-size: 12px;
 height:300px;
 max-height: 50%; 
 color:#fff;
 background: rgba(0, 0, 0, .5);
 display:none;`
    );
    document.body.appendChild(textarea);

    const getName = (content) => {
        const regex = /宝藏星球：(.+?)（/;
        if (!regex.test(content)) return content;
        return regex.exec(content)[1];
    };

    let index = 0;

    setInterval(() => {
        const hour = new Date().getHours();
        if (hour >= 2 && hour < 18) return;
        const second = new Date().getSeconds();
        if (second < 55 && second > 10) return; 
        const elems = [];
        document.body.querySelectorAll("p").forEach(elem => {
            if (["探险日志", "派遣记录"].includes(elem.innerText)) {
                elems.push(elem);
            }
        });
        if (elems.length !== 2) {
            textarea.style.display = "none";
            return;
        } else {
            textarea.style.display = "block";
        }
        const loading = document.body.querySelector(".boc-react-loading");
        if (loading && loading.style.display === "block") return;

        elems[(index++) % 2].click();
        try {
            const data = [];
            document.body
                .querySelectorAll(".records_report__xMjha .report_main__1FMWB")
                .forEach((elem) => {
                    const title = elem.querySelector(
                        ".report_title__2EtMW"
                    ).innerText;
                    const time = elem.querySelector(
                        ".report_time__17927"
                    ).innerText;

                    data.push({
                        name: getName(title),
                        time: time,
                    });
                });
            textarea.value = JSON.stringify(data);
            saveResult(data);
        } catch (ex) {
            textarea.value = ex;
        }
    }, 1000);

}();