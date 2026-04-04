export interface Notice {
  id: number;
  title: string;
  date: string;
  pinned: boolean;
}

export const notidata: Notice[] = [
  {
    id: 1,
    title: "Office closed on Feb 28 for maintenance",
    date: "Feb 22, 2026",
    pinned: true,
  },
  {
    id: 2,
    title: "New parking policy effective from March 1",
    date: "Feb 20, 2026",
    pinned: true,
  },
  {
    id: 3,
    title: "Annual team outing scheduled — RSVP by March 5",
    date: "Feb 18, 2026",
    pinned: false,
  },
  {
    id: 4,
    title: "IT systems upgrade this weekend — expect brief downtime",
    date: "Feb 16, 2026",
    pinned: false,
  },
];