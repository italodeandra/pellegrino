export default function serialize<T>(json: T): T {
  return JSON.parse(JSON.stringify(json));
}
