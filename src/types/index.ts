export type ActivityDetail = {
  title: string;
  type: string;
  date: string;
  details: string[];
  total: number;
  items: { name: string; qty: number }[];
};
