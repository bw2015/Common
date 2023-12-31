function formatDateTime(dateObject) {
    const padZero = (num) => {
        return num < 10 ? '0' + num : num;
    }
    // 获取年、月、日、小时、分钟和秒
    const year = dateObject.getFullYear();
    const month = padZero(dateObject.getMonth() + 1); // 月份是从0开始的，所以要加1
    const day = padZero(dateObject.getDate());
    const hours = padZero(dateObject.getHours());
    const minutes = padZero(dateObject.getMinutes());
    const seconds = padZero(dateObject.getSeconds());

    // 构建格式化后的日期时间字符串
    const formattedString = `${hours}:${minutes}:${seconds}`;

    return formattedString;
}

let lastTime = 0,
    sleepTime = Date.now();
// 超级运动会
const loadData = () => {
    console.clear();
    const startTime = Date.now();
    // 如果超过1分钟没有动过了，则刷新页面
    if (sleepTime !== 0 && startTime - sleepTime > 60 * 1000) {
        location.reload();
        return;
    }
   
    const elems = document.body.querySelectorAll(".innerContainer-K4SP3 [data-key]");
    if (!elems || elems.length === 0) return;

    const countdown = document.body.querySelector(".countDown-s4MJn .text-vZ8cy");
    if (!countdown) return;
    const text = countdown.innerText;
    if (/系统维护中/.test(text)) {
        location.reload();
        return;
    }
  
    const regex = /开始冲刺倒计时：(\d+)s/;
    if (!regex.test(text)) return;
    let coutndownValue = regex.exec(text)[1];

    let openTime = 0;
    const data = [];
    elems.forEach((elem, index) => {
        const openNumber = elem.getAttribute("data-key");
        if (openTime === 0) {
            openTime = Date.now() - (30 - coutndownValue) * 1000;
        } else {
            openTime -= 40 * 1000;
        }
        data.push({
            openNumber, openTime
        })
    });

    let resultElement = document.getElementById("result");
    if (!resultElement) {
        resultElement = document.createElement("div");
        resultElement.id = "result";
        resultElement.style = "position: absolute;left: 0;bottom: 0;right: 0;background-color: rgba(0,0,0,.2);padding: 12px;text-align: center;z-index:999; ";
        document.body.appendChild(resultElement);
    }
    if (lastTime != Math.floor(openTime / 1000)) {
        lastTime = Math.floor(openTime / 1000);
        fetch("https://api.a8.to/Common/API_SaveData?key=YY.SuperSport", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: "content=" + JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            resultElement.innerHTML = data.map(t => {
                return `<span style="background:linear-gradient(0deg,#ff9e9e -.7%,#fff6ee 99.3%); color:#954700; border-radius: 6px;margin: 6px;display: inline-block; padding: 3px;">时间: ${formatDateTime(new Date(t.openTime))}，号码: ${t.openNumber}</span>`;
            }).join("") + "<hr />" + `耗时：${Date.now() - startTime}ms`;
            sleepTime = Date.now();
        });
    }
};

setInterval(loadData, 1000);