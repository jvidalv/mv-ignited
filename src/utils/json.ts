import { MediavidaJson } from "../types/mediavida-json";

const MEDIAVIDA_KEY = "mediavida:plus";

const set = <K extends keyof MediavidaJson>(key: K, data: MediavidaJson[K]) => {
  const json = get();
  localStorage.setItem(MEDIAVIDA_KEY, JSON.stringify({ ...json, [key]: data }));
};

const get = (): MediavidaJson =>
  JSON.parse(localStorage.getItem(MEDIAVIDA_KEY) ?? "{}");

export const mvstore = {
  set,
  get,
};
