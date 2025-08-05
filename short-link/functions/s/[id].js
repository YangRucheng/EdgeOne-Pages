const html = url => {
    const encodeBase36 = str => {
        const bytes = new TextEncoder().encode(str);
        let num = 0n;
        for (let b of bytes) num = (num << 8n) + BigInt(b);
        return num.toString(36).toUpperCase();
    };

    const encodedUrl = encodeBase36(url);
    const _html = `
    <script>
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const decodeBase36 = b36 => {
            let num = 0n;
            for (const c of b36) num = num * 36n + BigInt(chars.indexOf(c));
            let hex = num.toString(16);
            if (hex.length % 2) hex = "0" + hex;
            const bytes = new Uint8Array(hex.length / 2);
            for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
            return new TextDecoder().decode(bytes);
        };
        const encodedUrl = "${encodedUrl}";
        const decodedUrl = decodeBase36(encodedUrl);
        window.location.href = decodedUrl;
    </script>
    `;
    return _html;
}


export async function onRequest({ request, params, env }) {
    const url = await short_link.get(params.id);
    if (!url)
        return new Response.redirect("/", 307);
    else
        return new Response(html(url), {
            headers: {
                'Content-Type': 'text/html'
            }
        })
}