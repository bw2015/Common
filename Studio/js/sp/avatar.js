// 原生JS开发的头像剪裁上传

if (!window["SP"]) window["SP"] = {};

// 纯原生的头像上传组件
!function (ns) {

    ns.Avatar = function (options) {
        // 加载样式
        !function () {
            var header = document.head;
            if (!header.querySelector("[id='sp-avatar-style']")) {
                var link = document.createElement("link");
                link.href = "//studio.a8.to/js/sp/avatar.css";
                link.rel = "stylesheet";
                link.id = "sp-avatar-style";
                header.appendChild(link);
            }
        }();
        if (!options) options = {};
        if (!options.size) options.size = 160;


        var mask = document.createElement("div");
        mask.classList.add("sp-avatar-mask");
        document.body.appendChild(mask);

        var diag = document.createElement("div");
        diag.classList.add("sp-avatar-diag");
        diag.innerHTML = ["<div class='sp-avatar-diag-title'>",
            "<h3 data-lang='title'>Crop your new profile picture</h3>",
            "<button class='close'><svg class='octicon octicon-x' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'><path fill-rule='evenodd' d='M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z'></path></svg></button>",
            "</div>",
            "<div class='sp-avatar-diag-body'></div><div class='sp-avatar-diag-footer'><button class='submit'>Set new profile picture</button></div>"].join("");
        document.body.appendChild(diag);


        var body = diag.querySelector(".sp-avatar-diag-body");
        body.innerHTML = ["<div class='sp-avatar-diag-file'><input type='file' accept='image/*' /></div>", "<div class='sp-avatar-diag-crop'>",
            "<img />",
            "<div class='crop-container'>",
            "<div data-crop-bo class='crop-box'>",
            "<div class='crop-outline'></div>",
            "<div data-direction='nw' class='handle nw'></div>",
            "<div data-direction='ne' class='handle ne'></div>",
            "<div data-direction='sw' class='handle sw'></div>",
            "<div data-direction='se' class='handle se'></div>",
            "</div>",
            "</div>",
            "</div>"].join("");

        var fileObj = body.querySelector("input[type='file']");
        var cropObj = body.querySelector(".sp-avatar-diag-crop");
        var img = cropObj.querySelector("img");
        var cropBox = cropObj.querySelector(".crop-box");
        var btn = diag.querySelector("button.submit");
        var closeBtn = diag.querySelector(".close");
        var maxSize, maxWidth, maxHeight, pos;

        // 更改大小
        var updateSize = function () {
            if (pos.size < 16) pos.size = 16;
            pos.size = Math.min(pos.size, maxSize);
            cropBox.style.width = pos.size + "px";
            cropBox.style.height = pos.size + "px";
        };

        // 更改位置
        var updatePosition = function () {
            if (pos.left < 0) pos.left = 0;
            pos.left = Math.min(pos.left, maxWidth - pos.size);
            cropBox.style.left = pos.left + "px";

            if (pos.top < 0) pos.top = 0;
            pos.top = Math.min(pos.top, maxHeight - pos.size);
            cropBox.style.top = pos.top + "px";
        };

        // 关闭
        var close = function () {
            document.body.removeChild(mask);
            document.body.removeChild(diag);
        };

        function dataURLtoBlob(dataurl) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                len = bstr.length,
                u8arr = new Uint8Array(len);
            while (len--) u8arr[len] = bstr.charCodeAt(len);
            return new Blob([u8arr], { type: mime });
        }

        // 拖动效果
        !function () {
            var isDrag = false;
            var startX, startY;

            cropBox.addEventListener("mousedown", function (e) {
                isDrag = true;
                startX = e.clientX - cropBox.offsetLeft;
                startY = e.clientY - cropBox.offsetTop;
            });

            cropBox.addEventListener("mousemove", function (e) {
                if (!isDrag) return;
                pos.left = e.clientX - startX;
                pos.top = e.clientY - startY;
                updatePosition();
            });

            cropBox.addEventListener("mouseup", function (e) {
                isDrag = false;
            });

            cropBox.addEventListener("mouseleave", function (e) {
                isDrag = false;
            });
        }();

        // 缩放效果
        !function () {
            var handle = cropBox.querySelector(".se");
            var isDrag = false;
            var startX, startY;

            handle.addEventListener("mousedown", function (e) {
                e.stopPropagation();
                isDrag = true;
                startX = e.clientX - pos.size;
                startY = e.clientY - pos.size;
            }, false);

            cropObj.addEventListener("mousemove", function (e) {
                if (!isDrag) return;
                e.stopPropagation();
                var x = e.clientX;
                pos.size = x - startX;
                updateSize();
            }, false);

            cropObj.addEventListener("mouseup", function (e) {
                isDrag = false;
            }, false);

            cropObj.addEventListener("mouseleave", function (e) {
                isDrag = false;
            }, false);
        }();

        // 提交保存
        !function () {
            btn.addEventListener("click", function () {
                diag.classList.add("loading");

                //#1 获取所有位置信息
                var info = {
                    img: {
                        scale: img.offsetWidth / img.naturalWidth,
                        width: img.offsetWidth,
                        height: img.offsetHeight
                    },
                    crop: {
                        width: cropBox.offsetWidth,
                        height: cropBox.offsetHeight,
                        left: cropBox.offsetLeft,
                        top: cropBox.offsetTop,
                        scale: options.size / cropBox.offsetWidth
                    }
                };

                canvas = document.createElement("canvas");
                canvas.width = canvas.height = options.size;
                var newCtx = canvas.getContext('2d');
                newCtx.drawImage(img,
                    // #1 在原图上面移动坐标点
                    info.crop.left / info.img.scale, info.crop.top / info.img.scale,
                    // #2 决定要截取的大小
                    info.crop.width / info.img.scale, info.crop.height / info.img.scale,
                    // #3 在画布中要显示到的位置
                    0, 0,
                    // #4 第二步中截取出来的图像要缩放到的尺寸
                    options.size, options.size
                );


                // 提交到图片保存接口
                var newDataURL = canvas.toDataURL("image/jpeg", 0.6);
                var newBlob = dataURLtoBlob(newDataURL);
                var file = new window.File([newBlob], "screenshot.jpeg", { type: newBlob.type });
                // 上传图片
                !function (file) {
                    var formData = new FormData();
                    formData.append('file', file);
                    var xhr = new XMLHttpRequest();                   
                    xhr.onload = function () {
                        close();
                        try {
                            // 取得响应消息
                            var result = JSON.parse(this.responseText);
                            if (options.callback) options.callback(result);
                        } catch (err) {
                            alert("发生错误");
                            console.log(err)
                        }
                    };
                    xhr.open('POST', options.url, true);
                    if (options.before) options.before(xhr);
                    xhr.send(formData);
                }(file);

            });
        }();


        closeBtn.addEventListener("click", close);

        img.onload = function () {
            maxWidth = cropObj.clientWidth;
            maxHeight = cropObj.clientHeight;
            maxSize = Math.min(maxWidth, maxHeight);
            pos = {
                size: maxSize / 2,
                left: 0,
                top: 0
            };
            updateSize();
            updatePosition();
        };

        fileObj.addEventListener("change", function () {
            body.classList.add("crop");
            img.src = URL.createObjectURL(this.files[0]);
        });
    };

}(SP);

