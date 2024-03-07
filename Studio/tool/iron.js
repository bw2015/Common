
const getNumber = src => {
    let fileName = src.substring(src.lastIndexOf('/') + 1);
    fileName = fileName.substring(0, fileName.indexOf('.'));
    let number = 0;
    switch (fileName) {
        case "arms_laserrod1":
            number = 1;
            break;
        case "arms_smg1":
            number = 2;
            break;
        case "arms_hammer1":
            number = 3;
            break;
        case "arms_broadsword1":
            number = 4;
            break;
        case "arms_chainsaw1":
            number = 5;
            break;
        case "arms_revolver1":
            number = 6;
            break;
        case "arms_gatling1":
            number = 7;
            break;
        case "arms_wrench1":
            number = 8;
            break;
        case "arms_cannon1":
            number = 9;
            break;
    }
    return number || fileName;
};

const saveResult = data => {
    fetch("https://api.a8.to/Common/API_SaveData?key=YY.Iron", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: "content=" + JSON.stringify(data)
    });
};

!function () {
    const textarea = document.createElement("textarea");
    textarea.setAttribute("style", `position: absolute;
    left: 0;
    right: 0;
    top: 42px;
    z-index: 9999;
    font-size: 12px;
    height: 100px; `);
    document.body.appendChild(textarea);

    setInterval(() => {
        //textarea.value = document.body.innerHTML;
        const elems = document.body.querySelectorAll("a.tab-nav__item");
        let btn1 = null, btn2 = null;
        elems.forEach(elem => {
            switch (elem.innerText) {
                case "历史记录":
                    btn1 = elem;
                    break;
                case "成功封印":
                    btn2 = elem;
                    break;
            }
        });
        if (!btn1 || !btn2) return;

        if (/数据加载中/.test(document.body.innerText)) {
            return;
        }

        if (!btn1.classList.contains("is-active")) {
            btn1.click();
        } else if (!btn2.classList.contains("is-active")) {
            btn2.click();
        }

        // 获取列表内容
        try {
            const data = [];
            document.body.querySelectorAll(".history-item").forEach(elem => {
                const img = elem.querySelector(".history-item__img");
                const time = elem.querySelector(".history-item__time");
                if (!img || !time) return;

                data.push({
                    number: getNumber(img.src),
                    openTime: time.innerText
                });
            });
            if (data.length) {
                textarea.value = JSON.stringify(data);
                saveResult(data);
            }
        } catch (ex) {
            textarea.value = ex;
        }
    }, 1000);
}();