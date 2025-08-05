const generate = async (length = 6) => {
    const _generate = (length) => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    let path;
    do {
        path = _generate(length).toUpperCase();
    } while (
        await short_link.get(path)
    );
    return path;
};

const verify = url => {
    const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;
    return regex.test(url);
};

export async function onRequestPost({ request, params, env }) {
    const body = await request.json();
    if (!verify(body.url))
        return new Response(JSON.stringify({
            "status": -1,
            "msg": "Invalid URL"
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    const path = await generate();
    await short_link.put(path, body.url)

    return new Response(JSON.stringify({
        "status": 0,
        "path": path,
        "url": body.url
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}