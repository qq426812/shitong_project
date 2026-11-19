
export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // 只关闭两个总数据查询接口
  const blockedPaths = [
    "/api/cert-all",
    "/api_3/cert-all",
    "/api_4/cert-all",
    "/api_5/cert-all",
    "/api_6/cert-all",
    "/admin",
     "/admin_1",
     "/admin_2",
     "/admin_3",
     "/admin_4",
     "/admin_5",
     "/admin_6",
    "/api_1/cert-all"
  ];

  if (blockedPaths.includes(url.pathname)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "该服务已失效"
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  }

  // 其他接口继续正常运行
  return next();
}
