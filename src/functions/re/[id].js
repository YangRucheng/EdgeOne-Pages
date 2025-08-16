export async function onRequest({ request, params, env }) {
    const url = await short_link.get(params.id);
    if (!url)
        return new Response.redirect("/", 307);
    else
        return new Response.redirect(url, 307);
}