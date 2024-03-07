// 抓鸭子
const ducks = {
    lastTime: 0,
    starTime: new Date(2020, 0, 1).getTime()
};

const saveResult = (data) => {
    fetch("https://api.a8.to/Common/API_SaveData?key=SKR.duck", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "content=" + JSON.stringify(data)
    }).then(res => res.json()).then(res => {
    });
};

setInterval(() => {
    const now = Date.now() / 1000;
    if (now - lastTime < 30) return;
    let container = document.body.querySelector(".container");
    if (!container) {
        container = document.createElement("div");
        container.setAttribute("style", `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    background-color: rgba(0,0,0,.5);
    max-height: 100px;
    border-radius: 12px;
    color: #fff;
    z-index:9999;
    font-size:12px;
    overflow:auto;
    padding:12px;
    text-shadow:1px 1px 0px #000;`);
        container.className = "container";
        document.body.appendChild(container);
    }
    let elems = document.body.querySelectorAll(".ducks_bgc_all > div");
    if (elems.length !== 3) return;

    elems[2].click();

    const result = [];
    //# 读取数据
    document.body.querySelectorAll(".grab .only .list-item .grab_main_item").forEach(t => {
        let name = t.querySelector(".grab_main_item_name").innerText;
        let time = new Date(`2024-${t.querySelector(".grab_main_item_time").innerText}`);

        result.push({
            duckName: name,
            createdTime: time.getTime() / 1000,
            gameID: Math.floor((time.getTime() - startTime) / 30000)
        });
    });

    if (result.length === 0) return;
    container.innerText = JSON.stringify(result);
    lastTime = result[0].createdTime;
    saveResult(result);
    //# 关闭抓取记录弹出框
    document.body.querySelectorAll(".van-overlay").forEach(elem => elem.click())

}, 1000);