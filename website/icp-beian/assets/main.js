window.onload = () => {
	if (location.protocol == "http:")
		location.replace(`https://${location.hostname}`);

	if (location.hostname.endsWith("yangrucheng.top"))
		(document.getElementById("name").innerText = document.title =
			"符号看象限"),
			(document.getElementById("miit").innerText = "湘ICP备2022020305号"),
			(document.getElementById("mps").innerText =
				"湘公网安备43040002000196号");
	else if (location.hostname.endsWith("misaka-network.top"))
		(document.getElementById("name").innerText = document.title =
			"御坂网络工作室"),
			(document.getElementById("miit").innerText = "湘ICP备2024051456号"),
			(document.getElementById("mps").innerText =
				"湘公网安备43040002000203号");
	else if (location.hostname.endsWith("noink.cn"))
		(document.getElementById("name").innerText = document.title = "无墨"),
			(document.getElementById("miit").innerText = "湘ICP备2024051456号"),
			(document.getElementById("mps").innerText = "");
	else
		(document.getElementById("name").innerText = document.title =
			"默认站点"),
			(document.getElementById("miit").innerText = "无备案号"),
			(document.getElementById("mps").innerText = "");

	const url = new URL(location.href);
	if (url.searchParams.get("title"))
		document.getElementById("title").innerText = document.title =
			url.searchParams.get("title");
};
