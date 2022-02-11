interface Promo {
  id: string
  supplier: string
  title: string
  price_in_caps: number
  code: string
}

export const PROMOS: Promo[] = [
  {
    id: "knicks",
    supplier: "Knicks",
    title: "$20 off tickets",
    price_in_caps: 30,
    code: "coldfront-knicks-scvxjiene",
  },
  {
    id: "lincoln-center",
    supplier: "Lincoln Center",
    title: "$10 off tickets",
    price_in_caps: 15,
    code: "coldfront-lincoln-tiurotuie",
  },
  {
    id: "zarbars",
    supplier: "Zarbars",
    title: "$10 off total",
    price_in_caps: 10,
    code: "zarbars-gljknfsjkghfs",
  },
  {
    id: "lyft",
    supplier: "Lyft",
    title: "$3 off next ride",
    price_in_caps: 5,
    code: "coldfront-gfjipgfsjfn",
  },
  {
    id: "joes-pizza",
    supplier: "Joe's Pizza",
    title: "Free drink",
    price_in_caps: 3,
    code: "cf-free-drink-iocvuiocvui",
  },
  {
    id: "united",
    supplier: "United",
    title: "Class upgrade",
    price_in_caps: 40,
    code: "fjkldsjkafnmjioprenc",
  },
  {
    id: "netflix",
    supplier: "Netflix",
    title: "$2 off subscription",
    price_in_caps: 7,
    code: "piougjhnglfsndlsd",
  },
];

export const PROMOS_BY_ID = PROMOS.reduce((result: { [id: string]: Promo }, promo: Promo) => {
  result[promo.id] = promo;
  return result;
}, {});