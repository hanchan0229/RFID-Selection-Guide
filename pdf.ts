
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Answers } from "./types";

// 見積添付用PDFを生成（ロゴなし）
export async function buildPdf(
  a: Answers,
  recs: { id:string; name:string; score:number; notes?:string; unit_cost_tier:"low"|"mid"|"high"; reasons:string[] }[]
): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 portrait (pt)
  const { width } = page.getSize();
  const margin = 40;
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // タイトル
  let y = 800;
  page.drawText("RFIDタグ選定レポート", { x: margin, y: y-20, size: 16, font: fontBold });
  y -= 50;

  // 基本情報
  const now = new Date();
  page.drawText(`作成日: ${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`, { x: margin, y, size: 10, font });
  const qty = a.quantity ?? 0;
  page.drawText(`必要数量: ${qty.toLocaleString()} 個`, { x: width/2, y, size: 10, font });
  y -= 18;

  // 条件まとめ
  const targetSize = a.targetSizeMm ? `${a.targetSizeMm.L}×${a.targetSizeMm.W}×${a.targetSizeMm.H}mm` : "-";
  const mountSize = a.maxSizeMm ? `${a.maxSizeMm.L}×${a.maxSizeMm.W}×${a.maxSizeMm.H}mm` : targetSize;
  const condLines = [
    `取付対象: ${a.target ?? "-"}`,
    `取付対象のサイズ: ${targetSize}`,
    `タグ貼付可能スペース（上限）: ${mountSize}`,
    `曲面可: ${a.curved ? "はい":"いいえ"}`,
    `環境: 温度上限 ${a.env?.tempMax ?? "-"}℃、IP ${a.env?.ip ?? "なし"}、屋外 ${a.env?.outdoor ? "あり":"なし"}、薬品 ${a.env?.chemicals ? "あり":"なし"}`,
    `読取距離: ${a.readRange ?? "-"}`,
    `目安コスト帯: ${a.costTier ?? "-"}`,
    `取付方法: ${a.mounting?.join(" / ") ?? "-"}`,
  ];
  page.drawText("■ 選定条件", { x: margin, y, size: 12, font: fontBold });
  y -= 16;
  condLines.forEach(line => { page.drawText(line, { x: margin+10, y, size: 10, font }); y -= 14; });
  y -= 6;

  // 候補表ヘッダ
  page.drawText("■ 推奨候補", { x: margin, y, size: 12, font: fontBold });
  y -= 16;

  // 表の描画
  const headers = ["タグ名","スコア","コスト帯","メモ/理由(抜粋)"];
  const colX = [margin, margin+240, margin+300, margin+360];
  headers.forEach((h,i)=> page.drawText(h, { x: colX[i], y, size: 10, font: fontBold }));
  y -= 12;
  page.drawLine({ start: {x: margin, y}, end: {x: width-margin, y}, thickness: 1, color: rgb(0.8,0.8,0.8) });
  y -= 8;

  for (const r of recs) {
    if (y < 80) { // 新ページ
      const p = pdf.addPage([595.28, 841.89]); y = 780;
      p.drawText("■ 推奨候補（続き）", { x: margin, y, size: 12, font: fontBold });
      y -= 16;
    }
    const reasonsText = [r.notes, ...r.reasons.slice(0,2)].filter(Boolean).join(" / ");
    page.drawText(r.name, { x: colX[0], y, size: 10, font });
    page.drawText(String(r.score), { x: colX[1], y, size: 10, font });
    page.drawText(r.unit_cost_tier, { x: colX[2], y, size: 10, font });
    page.drawText(reasonsText.length>70 ? reasonsText.slice(0,67)+"…" : reasonsText, { x: colX[3], y, size: 10, font });
    y -= 14;
  }

  // 備考欄
  y -= 10;
  page.drawText("■ 備考", { x: margin, y, size: 12, font: fontBold }); y -= 16;
  page.drawText("実導入前に現場での読取テストを推奨します。（金属・液体近傍、配置、アンテナ偏波などにより性能が変動します）", { x: margin+10, y, size: 10, font });

  const bytes = await pdf.save();
  return new Blob([bytes], { type: "application/pdf" });
}
