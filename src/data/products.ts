export type ProductId =
  | "koufomata"
  | "porta"
  | "antlia"
  | "leuitas"
  | "klimatismos"
  | "tzaki"
  | "iliakos"
  | "kaminada";

export interface Product {
  id: ProductId;
  title: string;
  shortTitle: string;
  description: string;
  brands?: string[];
  note?: string;
  storyLabel: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "koufomata",
    title: "Εξωτερικά κουφώματα PVC",
    shortTitle: "Κουφώματα",
    description:
      "Σύγχρονα συστήματα PVC με υψηλή θερμομόνωση και ακρίβεια εφαρμογής.",
    brands: ["KOMMERLING", "ALUPLAST", "DECEUNINCK"],
    storyLabel: "ΚΟΥΦΩΜΑΤΑ",
  },
  {
    id: "porta",
    title: "Θωρακισμένες πόρτες",
    shortTitle: "Πόρτα ασφαλείας",
    description:
      "Θωρακισμένες πόρτες ελληνικής κατασκευής για ασφάλεια χωρίς συμβιβασμούς.",
    note: "Ελληνικής κατασκευής",
    storyLabel: "ΑΣΦΑΛΕΙΑ",
  },
  {
    id: "antlia",
    title: "Αντλίες θερμότητας",
    shortTitle: "Αντλία θερμότητας",
    description:
      "Ενεργειακές λύσεις θέρμανσης και ψύξης από κορυφαίους κατασκευαστές.",
    brands: ["TOYOTOMI", "ARISTON", "SAMSUNG", "DAIKIN", "MIDEA"],
    storyLabel: "ΘΕΡΜΑΝΣΗ",
  },
  {
    id: "leuitas",
    title: "Λέβητες αερίου",
    shortTitle: "Λέβητας αερίου",
    description:
      "Αξιόπιστοι λέβητες για σταθερή απόδοση και μακροχρόνια λειτουργία.",
    brands: ["ARISTON", "BAXI", "DAIKIN", "NOVA FLORIDA", "SIME", "WOLF"],
    storyLabel: "ΛΕΒΗΤΕΣ",
  },
  {
    id: "klimatismos",
    title: "Κλιματιστικά",
    shortTitle: "Κλιματισμός",
    description:
      "Συστήματα κλιματισμού για άνεση σε κάθε εποχή, με επιλογές για κάθε χώρο.",
    brands: ["SAMSUNG", "TOYOTOMI", "GREE", "DAIKIN", "MIDEA", "TCL"],
    storyLabel: "ΚΛΙΜΑΤΙΣΜΟΣ",
  },
  {
    id: "tzaki",
    title: "Τζάκια",
    shortTitle: "Τζάκι",
    description:
      "Τζάκια απλής και ενεργειακής καύσης — ελληνικής κατασκευής και εισαγόμενα.",
    note: "Απλής και ενεργειακής καύσης",
    storyLabel: "ΕΝΕΡΓΕΙΑ",
  },
  {
    id: "iliakos",
    title: "Ηλιακοί θερμοσίφωνες",
    shortTitle: "Ηλιακός θερμοσίφωνας",
    description:
      "Ηλιακά συστήματα ελληνικής κατασκευής για ζεστό νερό με χαμηλότερο κόστος.",
    note: "Ελληνικής κατασκευής",
    storyLabel: "ΗΛΙΑΚΑ",
  },
  {
    id: "kaminada",
    title: "Καμινάδες INOX",
    shortTitle: "Καμινάδα INOX",
    description:
      "Ανθεκτικές καμινάδες INOX για ασφαλή και καθαρή απαγωγή καυσαερίων.",
    storyLabel: "ΚΑΜΙΝΑΔΕΣ",
  },
];

export const NAV_LINKS = [
  { href: "#hero", label: "Αρχική" },
  { href: "#lyseis", label: "Λύσεις" },
  { href: "#energeia", label: "Ενεργειακή Αναβάθμιση" },
  { href: "#diadikasia", label: "Διαδικασία" },
  { href: "#istoria", label: "Η Buildart" },
  { href: "#epikoinonia", label: "Επικοινωνία" },
] as const;

export const CONTACT = {
  phone: "6996681022",
  phoneDisplay: "699 668 1022",
  email: "buildartgr@gmail.com",
  addressLine1: "Λαγκαδά 2",
  addressLine2: "Θεσσαλονίκη",
  addressLine3: "2ος όροφος",
  founded: 1985,
  currentForm: 2020,
} as const;
