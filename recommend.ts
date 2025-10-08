
import { Answers, Tag } from "./types";

// ルール＋スコアリングで推奨候補を返す
export function recommend(tags: Tag[], a: Answers) {
  // 取り付け可能スペースの上限: maxSizeMm がなければ targetSizeMm を代用
  const sizeLimit = a.maxSizeMm ?? a.targetSizeMm;

  // 1) 必須フィルタ（ルール）
  let filtered = tags.filter(t => {
    // 金属物に取り付け → オンメタル必須
    if (a.target === "金属物" && !t.on_metal) return false;
    // >10mはUHF前提
    if (a.readRange === ">10" && t.band !== "UHF") return false;
    // 温度上限
    if (a.env?.tempMax !== undefined && t.temp[1] < a.env.tempMax) return false;
    // 取り付け方法
    if (a.mounting && !a.mounting.some(m => t.mounting_methods.includes(m))) return false;
    // サイズ（タグが貼付可能スペースに収まるか）
    if (sizeLimit) {
      const [L,W,H] = t.size_mm;
      if (L > sizeLimit.L || W > sizeLimit.W || H > sizeLimit.H) return false;
    }
    return true;
  });

  // 2) スコアリング（説明可能性付き）
  const scored = filtered.map(t => {
    let score = 0; const reasons: string[] = [];

    // 読取距離適合（40点）
    const reqM = a.readRange==="<1"?1: a.readRange==="1-3"?3: a.readRange==="3-10"?10: a.readRange?15:4;
    const maxM = t.read_range_m[1];
    const distScore = Math.min(maxM/reqM, 1)*40;
    score += distScore;
    reasons.push(`読取距離: 要件 ${reqM}m に対しタグ最大 ${maxM}m`);

    // 取付対象の特性に応じた加点（10点）
    if (a.target === "金属物" && t.on_metal) { score += 10; reasons.push("金属物: オンメタル対応"); }
    if (a.target === "液体物") { reasons.push("液体物: 実地テスト推奨（配置/アンテナ/偏波で変動）"); }

    // 取り付け方法一致（15点）
    if (a.mounting && a.mounting.some(m => t.mounting_methods.includes(m))) {
      score += 15;
      reasons.push(`取付方法: ${a.mounting.join(" / ")} に対応`);
    }

    // サイズ適合（15点）
    if (sizeLimit) { score += 15; reasons.push(`サイズ: ${t.size_mm.join("×")}mm が貼付可能スペースに収まる`); }

    // 環境（8点）
    if (a.env?.ip && t.ip && t.ip >= a.env.ip) { score += 8; reasons.push(`IP等級: ${t.ip}（要件満たす想定）`); }
    if (a.env?.chemicals) reasons.push("薬品/洗浄: メーカー仕様で要確認");

    // コスト一致（15点）
    if (a.costTier && t.unit_cost_tier === a.costTier) { score += 15; reasons.push("コスト帯: 一致"); }

    return { ...t, score: Math.round(score), reasons } as any;
  });

  // スコア降順で上位5件
  return scored.sort((x:any,y:any)=>y.score-x.score).slice(0,5);
}
