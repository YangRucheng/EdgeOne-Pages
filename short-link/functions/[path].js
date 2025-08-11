export async function onRequest({ request, params, env }) {
    const paths = params.path.split('.');
    if (paths.length !== 2)
        return new Response.redirect(`无效的路径 ${params.path}`, 400);
    const res = await verify.get(paths[0]);
    if (!res)
        return new Response.redirect(`不存在的路径`, 404);
    else
        return new Response(res)
}