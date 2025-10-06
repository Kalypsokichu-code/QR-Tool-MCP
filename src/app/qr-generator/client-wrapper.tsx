"use client";

import { createClientWrapper } from "@/lib/create-client-wrapper";

const QrClient = createClientWrapper({
  loader: () => import("./client"),
  exportName: "QrClient",
  loadingHeight: "400px",
});

export default QrClient;
