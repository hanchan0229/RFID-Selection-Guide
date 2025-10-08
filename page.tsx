
"use client";
import { useState } from "react";
import Wizard from "@/components/Wizard";
import { TAGS } from "@/lib/tags";
import { recommend } from "@/lib/recommend";
import { Answers } from "@/lib/types";
import ResultCard from "@/components/ResultCard";
import { buildPdf } from "@/lib/pdf";
import "./globals.css";

export default function Page() {
  const [state, setState] = useState<{ answers?: Answers; results?: any[] }>({});

  async function handlePdf() {
    if (!state.answers || !state.results) return;
    const blob = await buildPdf(
      state.answers,
      state.results.map(r => ({ id: r.id, name: r.name, score: r.score, notes: r.notes, unit_cost_tier: r.unit_cost_tier, reasons: r.reasons }))
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "RFIDタグ選定レポート.pdf"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <Wizard onRecommend={(answers) => {
        const res = recommend(TAGS, answers);
        setState({ answers, results: res });
      }} />
      {state.results && (
        <section>
          <h2>推奨候補</h2>
          {state.results.map(r => <ResultCard key={r.id} item={r} />)}
          <button onClick={handlePdf}>PDFをダウンロード</button>
        </section>
      )}
    </main>
  );
}
