const url = "https://images.orientbell.com/media/catalog/product/no_selection";
fetch(url, { method: "HEAD" })
  .then((r) => console.log("no_selection:", r.status))
  .catch((e) => console.log("no_selection ERR:", e.message));

const url2 = "https://server.orientbell.com/media/catalog/product/o/d/odm_nexa_granule_grey_plus.jpg";
fetch(url2, { method: "HEAD" })
  .then((r) => console.log("server-hosted:", r.status))
  .catch((e) => console.log("server-hosted ERR:", e.message));

const url3 = "https://images.orientbell.com/media/BDF%20Taupe%20Cement%20FT.jpg";
fetch(url3, { method: "HEAD" })
  .then((r) => console.log("space-encoded:", r.status))
  .catch((e) => console.log("space-encoded ERR:", e.message));

const url4 = "https://images.orientbell.com/media/BDF%20Taupe%20Cement%20FT.jpg";
fetch(url4, { method: "GET" })
  .then(async (r) => {
    const b = await r.arrayBuffer();
    console.log("space-encoded GET:", r.status, "bytes:", b.byteLength, "type:", r.headers.get("content-type"));
  })
  .catch((e) => console.log("space-encoded GET ERR:", e.message));