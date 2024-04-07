export function getFilename(path) {
  return (
    path && path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))
  );
}
