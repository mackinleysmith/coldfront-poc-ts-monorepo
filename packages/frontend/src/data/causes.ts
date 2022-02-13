export interface Cause {
  id: string;
  title: string;
}

export const CAUSES: Cause[] = [
  {
    id: "regenerative-farming",
    title: "Regenerative Farming",
  },
  {
    id: "circular-economy",
    title: "Circular Economy",
  },
  {
    id: "new-food",
    title: "New Food",
  },
];

export const CAUSES_BY_ID = CAUSES.reduce((result: { [id: string]: Cause }, option: Cause) => {
  result[option.id] = option;
  return result;
}, {});