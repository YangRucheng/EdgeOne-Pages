// _worker.js

const TLD_LIST = [
    "com", "net", "org", "info", "biz", "xyz", "top", "online", "site", "shop", "club", "vip",
    "app", "cloud", "dev", "tech", "name", "pro", "me", "mobi", "asia", "io", "ai",
    "cn", "us", "uk", "de", "fr", "jp", "kr", "ru", "in", "ca", "au", "eu", "hk", "tw", "sg"
];

/**
 * 代理请求 HTML 页面
 * @param {*} url 
 */
const proxyHtml = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    return new Response(html, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=31536000, immutable',
        }
    });
}

// 确保 URL 带有协议
const ensureProtocol = url => url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

// 创建响应头
const newResponseHeaders = (headers, request) => {
    let _headers = new Headers([...headers].filter(([name]) => !name.startsWith('cf-') && !name.startsWith('eo-')));
    _headers.set('Cache-Control', 'no-store');
    _headers.set('Content-Disposition', 'attachment');
    _headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
    _headers.set('Access-Control-Allow-Headers', '*');
    _headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return _headers;
}

// 创建请求头
const newRequestHeaders = headers => Object.fromEntries(
    headers.entries().filter(
        ([name, value]) => ["eo-", "cf-", "cdn-", "host", "content"].every(i => !name.toLowerCase().startsWith(i))
    )
);

// 返回重定向确认页面的 HTML
const getRedirectHtml = url => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>是否前往？</title>
    <link rel="icon" type="image/png" href="https://blog.yangrucheng.top/favicon.ico">
    <style>
        body {
        font-family: sans-serif;
        background: #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        }
        .box {
        background: white;
        padding: min(6vh, 12vw) min(8vh, 16vw);
        border-radius: 16px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        text-align: center;
        }
        .url {
        color: gray;
        font-size: small;
        max-width: 40vw;
        overflow: hidden;
        word-break: break-all;
        }
        .button {
        display: block;
        margin: 10px;
        padding: 10px 20px;
        background: #2080F0;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="box">
        <h2>要前往新的页面吗？喵呜</h2>
        <div class="url">${url}</div>
        <a href="${url}" class="button">确定前往</a>
    </div>
</body>
</html>
`;


export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 如果访问根目录，返回HTML
        if (["/", "/index.html", "index.php"].some(path => url.pathname === path))
            return proxyHtml("https://raw.githubusercontent.com/YangRucheng/EdgeOne-Pages/main/website/all-proxy/root.html")

        // 如果访问网站图标
        if (url.pathname.includes("/favicon.ico"))
            return new Response(null, {
                status: 301,
                headers: {
                    'Location': "https://blog.yangrucheng.top/favicon.ico",
                    'Cache-Control': 'public, max-age=31536000, immutable',
                }
            });

        // 从请求路径中提取目标 URL
        let actualUrlStr = decodeURIComponent(url.pathname.replace("/", ""));

        // 域名格式不合法
        if (!actualUrlStr.replace(/^\.+|\.+$/g, "").includes("."))
            return new Response(null, {
                status: 301,
                headers: {
                    'Location': "https://www.baidu.com",
                    'Cache-Control': 'public, max-age=31536000, immutable',
                }
            });

        // 不包含顶级域
        if (TLD_LIST.every(i => !actualUrlStr.includes(`.${i}`)))
            return new Response(null, {
                status: 301,
                headers: {
                    'Location': "https://www.baidu.com",
                    'Cache-Control': 'public, max-age=31536000, immutable',
                }
            });

        // 确保用户输入的 URL 带有协议
        actualUrlStr = ensureProtocol(actualUrlStr) + url.search;
        console.info(`${request.method} 请求 ${actualUrlStr}`);
        console.info(newRequestHeaders(request.headers))

        // 创建一个新的请求以访问目标 URL
        const modifiedRequest = new Request(actualUrlStr, {
            headers: newRequestHeaders(request.headers),
            method: request.method,
            body: request.body,
            redirect: 'manual',
        });

        try {
            const response = await fetch(modifiedRequest);

            if ([301, 302, 307, 308].includes(response.status)) // 重定向响应
                return new Response(getRedirectHtml(response.headers.get('location')), {
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8',
                        'Cache-Control': 'public, max-age=31536000, immutable',
                    }
                })
            else // 其他响应
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newResponseHeaders(response.headers, request),
                });

        } catch (error) {
            return new Response(JSON.stringify({
                msg: error.message,
                status: -1,
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
        }
    }
}