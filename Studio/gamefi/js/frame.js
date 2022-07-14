let frame = options => {
    let saveKey = `${options.project}:SAVE`;
    let container = document.body.querySelector("container");
    let createFrame = aid => {
        let frame = document.createElement("div"),
            shadow = document.createElement("shadow");

        frame.className = "frame";
        frame.innerHTML = "<a href=\"javascript:\"></a>";
        frame.querySelector("a").addEventListener("click", e => {
            loadFrame(frame);
            createFrame();
        });

        container.appendChild(frame);
        container.appendChild(shadow);

        if (aid) {
            loadFrame(frame, aid);
        }
        return frame;
    },
        loadFrame = (frame, aid) => {
            let iframe = document.createElement("iframe");
            iframe.src = `${options.index || "index.html"}?v=${new Date().getTime()}` + (aid && `&aid=${aid}` || "");
            if (aid) iframe.setAttribute("data-aid", aid);
            frame.appendChild(iframe);

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = aid;
            checkbox.name = "aid";
            frame.appendChild(checkbox);

            let zoom = document.createElement("button");
            zoom.type = "button";
            zoom.className = "layui-btn layui-btn-xs layui-btn-primary am-icon-windows";
            frame.appendChild(zoom);

            zoom.addEventListener("click", e => {
                if (frame.classList.contains("zoom")) {
                    frame.classList.remove("zoom");
                } else {
                    frame.classList.add("zoom");
                }
            });

            frame.querySelector("a").remove();
        },
        // 批量加载初始化框
        loadFrames = arr => {
            arr.forEach(aid => {
                let a = container.querySelector(".frame > a");
                if (!a) return;
                let frame = a.parentNode;
                loadFrame(frame, aid);
                createFrame();
            });
        },
        init = () => {
            createFrame();
        };

    init();

    // 批量链接操作
    if (options.link) {
        options.link.querySelectorAll("[data-href]").forEach(t => {
            t.addEventListener("click", e => {
                let href = t.getAttribute("data-href"),
                    frames = document.body.querySelectorAll("iframe");

                frames.forEach(frame => {
                    frame.contentWindow.location.hash = "/" + href;
                });
            });
        });
    }

    return {
        createFrame,
        loadFrames
    };

}