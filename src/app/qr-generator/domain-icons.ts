export function readFileAsSvg(file: File): Promise<string | null> {
  if (!file.type.includes("svg")) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  });
}
