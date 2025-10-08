
// 入力回答の型定義（日本語）
export type Answers = {
  target?: "液体物"|"金属物"|"プラスチック"|"その他";
  mounting?: ("粘着"|"リベット/ネジ"|"ケーブルタイ"|"吊り下げ"|"縫い付け"|"埋め込み")[];
  /** 取付対象そのもののサイズ（mm） */
  targetSizeMm?: { L:number; W:number; H:number };
  /** タグ取り付け可能スペースの上限サイズ（mm）。未入力時は targetSizeMm を代用 */
  maxSizeMm?: { L:number; W:number; H:number };
  curved?: boolean;
  env?: { tempMax?: number; ip?: "なし"|"IP54"|"IP67"|"IP68"; chemicals?: boolean; outdoor?: boolean };
  readRange?: "<1"|"1-3"|"3-10"|">10";
  costTier?: "low"|"mid"|"high";
  quantity?: number;
};

// タグデータの型定義
export type Tag = {
  id: string;
  name: string;
  band: "UHF"|"HF/NFC"|"LF";
  on_metal: boolean;
  mounting_methods: string[];
  size_mm: [number,number,number]; // L,W,H
  curved_surface: boolean;
  read_range_m: [number,number];
  temp: [number,number];
  ip?: "IP54"|"IP67"|"IP68";
  wash_cycles?: number;
  unit_cost_tier: "low"|"mid"|"high";
  printable?: boolean;
  encodeable?: boolean;
  notes?: string;
  datasheet_url?: string;
};
