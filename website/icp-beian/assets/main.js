window.onload = () => {
	if (location.protocol == "http:")
		location.replace(`https://${location.hostname}`);

	const title = document.getElementById("title");
	const name = document.getElementById("name");
	const miit = document.getElementById("miit");
	const mps = document.getElementById("mps");

	if (location.hostname.endsWith("yangrucheng.top"))
		name.innerText = document.title = "符号看象限",
			miit.innerText = "湘ICP备2022020305号",
			mps.innerText = "湘公网安备43040002000196号";
	else if (location.hostname.endsWith("misaka-network.top"))
		name.innerText = document.title = "御坂网络工作室",
			miit.innerText = "湘ICP备2024051456号",
			mps.innerText = "湘公网安备43040002000203号";
	else if (location.hostname.endsWith("19890605.xyz"))
		name.innerText = document.title = "长安街上的那个人",
			miit.innerText = "湘ICP备2022020305号",
			mps.innerText = "";
	else
		name.innerText = document.title = "默认站点",
			miit.innerText = "无备案号",
			mps.innerText = "";

	const url = new URL(location.href);
	if (url.searchParams.get("title"))
		title.innerText = document.title = url.searchParams.get("title");
};
