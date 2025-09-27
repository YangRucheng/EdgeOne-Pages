// _worker.js

const host = "docker.proxy.yangrucheng.top";

/**
 * 构造响应
 * @param {any} body 响应体
 * @param {number} status 响应状态码
 * @param {Object<string, string>} headers 响应头
 */
const makeRes = (body, status = 200, headers = {}) => {
    headers['access-control-allow-origin'] = '*' // 允许所有来源
    return new Response(body, {
        status: status,
        headers: headers,
    })
}

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

/**
 * 安全重定向
 * @param {Request} request 请求对象
 * @param {string} location 请求地址
 */
const safeRedirect = async (request, location) => {
    const reqHdrNew = new Headers(request.headers);
    reqHdrNew.delete("Authorization");

    const url = new URL(location, "https://registry-1.docker.io")
    const response = await fetch(new Request(url, {
        method: request.method,
        headers: reqHdrNew,
        redirect: 'follow',
        body: request.body
    }))
    const headers = new Headers(response.headers);

    headers.set('access-control-expose-headers', '*');
    headers.set('access-control-allow-origin', '*');
    headers.set('Cache-Control', 'max-age=1500');

    headers.delete('content-security-policy');
    headers.delete('content-security-policy-report-only');
    headers.delete('clear-site-data');

    return new Response(response.body, {
        status: response.status,
        headers: headers
    });
}

/**
 * 获取 Docker 仓库的匿名访问令牌
 * @param {Request} request 请求对象
 * @param {string} pathname 请求路径
 * @returns 
 */
const getToken = async (request, pathname) => {
    const v2Match = pathname.match(/^\/v2\/(.+?)(?:\/(manifests|blobs|tags)\/)/);
    if (!v2Match) return "";
    const repo = v2Match[1];
    if (!repo) return "";
    const token_url = `https:///auth.docker.io/token?service=registry.docker.io&scope=repository:${repo}:pull`;
    const tokenRes = await fetch(token_url, {
        headers: {
            'User-Agent': request.headers.get("User-Agent"),
            'Accept': request.headers.get("Accept"),
            'Accept-Language': request.headers.get("Accept-Language"),
            'Accept-Encoding': request.headers.get("Accept-Encoding"),
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=3600'
        },
    });
    const tokenData = await tokenRes.json();
    return tokenData.token || "";
}


export default {
    async fetch(request, env, ctx) {
        let url = new URL(request.url);

        // 根据 User-Agent 屏蔽爬虫
        const userAgent = (request.headers.get('User-Agent') || "").toLowerCase();
        if (["netcraft"].some(ua => userAgent.includes(ua)))
            return makeRes("What are you doing?", 403);

        // 常见文件类型屏蔽
        if ([".png", ".jpg", ".gif", ".bmp", ".svg", ".ico"].some(ext => url.pathname.endsWith(ext)))
            return makeRes("What are you doing?", 403);

        // 隐藏根目录
        if (["/", "/index.html", "index.php"].some(path => url.pathname === path))
            return proxyHtml("https://raw.githubusercontent.com/YangRucheng/EdgeOne-Pages/main/website/docker-proxy/nginx.html")

        // 预检请求直接响应
        if (request.method === 'OPTIONS')
            return new Response(null, {
                headers: new Headers({
                    'access-control-allow-origin': 'null',
                    'access-control-max-age': '1728000',
                }),
            });


        // 更改请求的主机名
        url.hostname = "registry-1.docker.io";

        // 修改包含 %2F 和 %3A 的请求
        if (!/%2F/.test(url.search) && /%3A/.test(url.toString()))
            url = new URL(url.toString().replace(/%3A(?=.*?&)/, '%3Alibrary%2F'));

        // 重写 library 路径
        if (/^\/v2\/[^/]+\/[^/]+\/[^/]+$/.test(url.pathname) && !/^\/v2\/library/.test(url.pathname))
            url.pathname = '/v2/library/' + url.pathname.split('/v2/')[1];

        // 处理 Auth 请求
        if (url.pathname.includes('/token')) {
            const token_url = `https://auth.docker.io${url.pathname}${url.search}`;
            console.info("获取令牌：", request.headers.get("Authorization"));
            return fetch(new Request(token_url, request), {
                headers: {
                    'Host': 'auth.docker.io',
                    'User-Agent': request.headers.get("User-Agent"),
                    'Accept': request.headers.get("Accept"),
                    'Accept-Language': request.headers.get("Accept-Language"),
                    'Accept-Encoding': request.headers.get("Accept-Encoding"),
                    'Connection': 'keep-alive',
                    'Cache-Control': 'max-age=0',
                    'Authorization': request.headers.get("Authorization") || await getToken(request, url.pathname) || "",
                }
            });
        }

        // 构造请求参数
        let parameter = {
            headers: {
                'Host': "registry-1.docker.io",
                'User-Agent': request.headers.get("User-Agent"),
                'Accept': request.headers.get("Accept"),
                'Accept-Language': request.headers.get("Accept-Language"),
                'Accept-Encoding': request.headers.get("Accept-Encoding"),
                'Connection': 'keep-alive',
                'Cache-Control': 'max-age=300',
                'Authorization': request.headers.get("Authorization") || "",
                'X-Amz-Content-Sha256': request.headers.get("X-Amz-Content-Sha256") || "",
            },
        };

        // 发起请求并处理响应
        const original_response = await fetch(new Request(url, request), parameter);
        const original_response_clone = original_response.clone();
        const original_text = original_response_clone.body;
        const response_headers = new Headers(original_response.headers);

        // 处理重定向
        if (response_headers.get("Location")) {
            const location = response_headers.get("Location");
            console.info(`跟随重定向到：${location}`);
            return safeRedirect(request, location);
        }

        // 修改 Www-Authenticate 头
        if (response_headers.get("Www-Authenticate")) {
            const re = new RegExp("https://auth.docker.io", 'g');
            const auth_url = response_headers.get("Www-Authenticate").replace(re, `https://${host}`);
            response_headers.set("Www-Authenticate", auth_url);
        }

        // 返回修改后的响应
        return new Response(original_text, {
            status: original_response.status,
            headers: response_headers,
        });;
    }
};
