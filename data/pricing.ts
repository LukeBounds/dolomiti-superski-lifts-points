export const PASS_PRICING = {
  highSeason: [
    { days: 1, price: 86 },
    { days: 2, price: 170 },
    { days: 3, price: 248 },
    { days: 4, price: 317 },
    { days: 5, price: 380 },
    { days: 6, price: 436 },
    { days: 7, price: 462 },
    { days: 8, price: 517 },
    { days: 9, price: 570 },
    { days: 10, price: 620 },
    { days: 12, price: 713 },
    { days: 15, price: 832 },
    { days: 20, price: 1016 },
  ],
  lowSeason: [
    { days: 1, price: 77 },
    { days: 2, price: 153 },
    { days: 3, price: 223 },
    { days: 4, price: 285 },
    { days: 5, price: 342 },
    { days: 6, price: 392 },
    { days: 7, price: 416 },
    { days: 8, price: 466 },
    { days: 9, price: 513 },
    { days: 10, price: 558 },
    { days: 12, price: 642 },
    { days: 15, price: 711 },
    { days: 20, price: 915 },
  ],
  specials: [
    { label: "10 Superdays (non-consecutive)", price: 660, perDay: 66 },
    { label: "Season pass", price: 1040, perDay: null },
  ],
  earlyBookingDiscount: 0.05,
};

export const POINT_CARD_TIERS = [
  { points: 600, price: 50 },
  { points: 1000, price: 80 },
  { points: 2100, price: 150 },
];
