/* clarity */
(function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "r9y88ujzgy");

let list = [];

/* 根据 UA 过滤部分链接 */
const getfiltereList = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    const filtereList = list.filter(item => {
        return item.device === 'all' || (isMobile && item.device === 'mobile') || (!isMobile && item.device === 'desktop');
    });
    console.info("过滤后的链接", filtereList);
    return filtereList;
}

/* 随机获取一个目标链接 */
const getTargetItem = (filtereList) => {
    let weightedList = []; // 加权数组
    filtereList.forEach(link => {
        for (let i = 0; i < link.probability; i++)
            weightedList.push(link);
    });
    if (!weightedList.length) return null;
    target = weightedList[Math.floor(Math.random() * weightedList.length)];
    return target;
}

/* 显示 QQ 弹窗 */
const showQQ = (item) => {
    const dialog = document.getElementById("dialog-qq");
    const dialogTitle = dialog.querySelector(".dialog-title");
    const dialogMask = dialog.querySelector(".dialog-mask");
    const copyButton = dialog.querySelector("#copy-qq");

    dialogTitle.innerHTML = `${item.title}<br>QQ：${item.qq}<br>请在对应群聊中反馈问题或讨论，否则可能被请出群聊！`;

    copyButton.onclick = () => {
        navigator.clipboard.writeText(item.qq)
            .then(() => alert("QQ 已复制到剪贴板"))
            .catch(() => alert("复制失败，请手动复制"));
    };
    dialogMask.onclick = () => dialog.hidden = true;
    dialog.hidden = false;
}

/* 用户点击跳转 */
const toLink = (user, target) => {
    const dialog = document.getElementById("dialog-to");
    const dialogTitle = dialog.querySelector(".dialog-title");
    const dialogMask = dialog.querySelector(".dialog-mask");
    const toButton = dialog.querySelector("#to");

    if (target.title == user.title)
        dialogTitle.innerHTML = `您点击的是本站推荐的 ${user.title}`;
    else
        dialogTitle.innerHTML = `您点击的是 ${user.title}<br>但本站推荐的是 ${target.title}<br>因此您将要前往的是 ${target.title}`;

    toButton.onclick = () => window.location.href = target.url;
    dialog.hidden = false;

    let countdown = 6;
    const interval = setInterval(() => {
        countdown--;
        toButton.textContent = `立即前往（${countdown}s）`;
        if (countdown <= 0) {
            clearInterval(interval);
            window.location.href = target.url;
        }
    }, 1000);
}

window.onload = () => {
    if (window.location.pathname != "/") {
        location.replace("/")
        return;
    }

    fetch(`/assets/tools.json?_t=${Date.now()}`)
        .then(resp => resp.json())
        .then(res => list = res)
        .then(() => {
            const filtereList = getfiltereList();
            const target = getTargetItem(filtereList);
            filtereList.forEach(item => {
                const itemTemplate = document.getElementById("item");
                const listElement = document.getElementById("list");

                const newItem = itemTemplate.content.cloneNode(true);
                newItem.querySelector(".item-description").textContent = item.description || "体验更多功能";
                newItem.querySelector(".item-qq").onclick = () => showQQ(item);
                newItem.querySelector(".item-content").onclick = () => toLink(item, target);

                if (target.title == item.title) {
                    newItem.querySelector(".item").classList.add("target-item");
                    newItem.querySelector(".item-title").textContent = `（推荐）${item.title}`;
                } else {
                    newItem.querySelector(".item-title").textContent = item.title;
                }

                listElement.appendChild(newItem);
            })
        })
}