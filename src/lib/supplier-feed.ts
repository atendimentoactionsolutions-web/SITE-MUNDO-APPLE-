import https from "node:https";

export function fetchSupplierItems(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    // Explicit IPv4 avoids broken IPv6 routes in container networks.
    const request = https.get(process.env.SUPPLIER_API_URL || "https://srv2058756.hstgr.cloud/api/products", {
      family: 4,
      headers: { "User-Agent": "MundoAppleSync/2.0", "Accept": "application/json", "Cache-Control": "no-cache" },
    }, response => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Fornecedor retornou HTTP ${response.statusCode}`));
        return;
      }
      let body = "";
      response.setEncoding("utf8");
      response.on("data", chunk => {
        body += chunk;
        if (body.length > 20_000_000) request.destroy(new Error("Resposta do fornecedor excede o limite."));
      });
      response.on("error", reject);
      response.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (!Array.isArray(json.data) || !json.data.length) throw new Error("Catalogo do fornecedor vazio ou invalido.");
          resolve(json.data);
        } catch (err) { reject(err); }
      });
    });
    const timeout = setTimeout(() => request.destroy(new Error("Tempo limite de 20s ao consultar fornecedor.")), 20000);
    request.on("close", () => clearTimeout(timeout));
    request.on("error", err => reject(new Error(`Falha no fornecedor: ${(err as NodeJS.ErrnoException).code || err.message}`)));
  });
}
