// 保存信息进入公共存储空间的共用方法
const textareaId = "saveResult";
window["saveResult"] = function (data, key) {
    if (typeof data !== "string") data = JSON.stringify(data);

    let textarea = document.getElementById(textareaId);
    if (!textarea) {
        textarea = document.createElement("textarea");
        textarea.id = textareaId;
        textarea.setAttribute("style", `
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 20%;
    font-size: 12px;
    background-color:#fff,
    color:#000;
    z-index: 99999999;`);
        document.body.appendChild(textarea);
    }

    if (!data || !key) return;

    textarea.value = window["showResult"] && window["showResult"](data) || data;

    // 检查数据是否符合规则
    if (window["checkResult"] && !window["checkResult"](data)) {
        textarea.style.backgroundColor = '#f00';
        textarea.style.color = '#fff';
        return;
    } else {
        textarea.style.backgroundColor = '#fff';
        textarea.style.color = '#000'
    }

    var formData = new URLSearchParams();
    formData.append('content', data);

    fetch(`https://api.a8.to/Common/API_SaveData?key=${key}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
    }).then(res => res.json()).then(res => {
        textarea.value = data;
    })
}