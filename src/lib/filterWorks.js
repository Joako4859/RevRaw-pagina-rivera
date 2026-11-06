export const ALL_CATEGORY = "Todos";

export function filterWorks(works, category) {
  if (category === ALL_CATEGORY) return works.slice();
  return works.filter((work) => work.category === category);
}
