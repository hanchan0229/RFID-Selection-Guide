
"use client";
import { useState } from "react";
import { Answers } from "@/lib/types";

export default function Wizard({ onRecommend }: { onRecommend: (a: Answers)=>void }) {
  const [a, setA] = useState<Answers>({ quantity: 100 });

  return (
    <div className="wizard">
      <h1>RFIDタグ選定ナビ</h1>

      {/* 取付対象（4種類） */}
      <section>
        <label>取付対象</label>
        <div className="chips">
          {["液体物","金属物","プラスチック","その他"].map(v =>
            <button key={v} className={a.target===v ? "active":""} onClick={()=>setA({...a, target: v as any})}>{v}</button>
          )}
        </div>
      </section>

      {/* 取付方法 */}
      <section>
        <label>取り付け方法</label>
        <div className="chips">
          {["粘着","リベット/ネジ","ケーブルタイ","吊り下げ","縫い付け","埋め込み"].map(v =>
            <button key={v}
              className={a.mounting?.includes(v as any) ? "active":""}
              onClick={()=>{
                const cur = new Set(a.mounting||[]);
                cur.has(v as any) ? cur.delete(v as any) : cur.add(v as any);
                setA({...a, mounting: Array.from(cur) as any});
              }}>{v}</button>
          )}
        </div>
      </section>

      {/* 取付対象のサイズ（参考） */}
      <section>
        <label>取付対象のサイズ（mm）</label>
        <div className="row">
          <input type="number" placeholder="対象 L" value={a.targetSizeMm?.L ?? ""} onChange={e=>setA({...a, targetSizeMm: {...a.targetSizeMm, L:Number(e.target.value)} as any})}/>
          <input type="number" placeholder="対象 W" value={a.targetSizeMm?.W ?? ""} onChange={e=>setA({...a, targetSizeMm: {...a.targetSizeMm, W:Number(e.target.value)} as any})}/>
          <input type="number" placeholder="対象 H" value={a.targetSizeMm?.H ?? ""} onChange={e=>setA({...a, targetSizeMm: {...a.targetSizeMm, H:Number(e.target.value)} as any})}/>
        </div>
        <small>※貼付可能面の目安として利用します。未入力でも可。</small>
      </section>

      {/* タグのサイズ上限（貼付面の制約） */}
      <section>
        <label>タグサイズ上限（取り付け可能スペース / mm）</label>
        <div className="row">
          <input type="number" placeholder="L" value={a.maxSizeMm?.L ?? ""} onChange={e=>setA({...a, maxSizeMm: {...a.maxSizeMm, L:Number(e.target.value)} as any})}/>
          <input type="number" placeholder="W" value={a.maxSizeMm?.W ?? ""} onChange={e=>setA({...a, maxSizeMm: {...a.maxSizeMm, W:Number(e.target.value)} as any})}/>
          <input type="number" placeholder="H" value={a.maxSizeMm?.H ?? ""} onChange={e=>setA({...a, maxSizeMm: {...a.maxSizeMm, H:Number(e.target.value)} as any})}/>
          <label className="chk"><input type="checkbox" checked={a.curved||false} onChange={e=>setA({...a, curved: e.target.checked})}/>曲面OK</label>
        </div>
      </section>

      {/* 環境 */}
      <section>
        <label>環境</label>
        <div className="row">
          <input type="number" placeholder="温度上限(℃)" value={a.env?.tempMax ?? ""} onChange={e=>setA({...a, env: {...a.env, tempMax: Number(e.target.value)}})} />
          <select value={a.env?.ip ?? "なし"} onChange={e=>setA({...a, env: {...a.env, ip: e.target.value as any}})}>
            {["なし","IP54","IP67","IP68"].map(v=>
              <option key={v} value={v}>{v}</option>
            )}
          </select>
          <label className="chk"><input type="checkbox" checked={a.env?.outdoor||false} onChange={e=>setA({...a, env:{...a.env, outdoor:e.target.checked}})}/>屋外</label>
          <label className="chk"><input type="checkbox" checked={a.env?.chemicals||false} onChange={e=>setA({...a, env:{...a.env, chemicals:e.target.checked}})}/>薬品/洗浄</label>
        </div>
      </section>

      {/* 読取距離 */}
      <section>
        <label>読取距離</label>
        <div className="chips">
          {["<1","1-3","3-10",">10"].map(v=>
            <button key={v} className={a.readRange===v ? "active":""} onClick={()=>setA({...a, readRange: v as any})}>{v} m</button>
          )}
        </div>
      </section>

      {/* コスト帯 */}
      <section>
        <label>目安コスト帯</label>
        <div className="chips">
          {["low","mid","high"].map(v=>
            <button key={v} className={a.costTier===v ? "active":""} onClick={()=>setA({...a, costTier: v as any})}>
              {v==="low"?"低":v==="mid"?"中":"高耐久"}
            </button>
          )}
        </div>
      </section>

      {/* 必要数量 */}
      <section>
        <label>必要数量</label>
        <input type="number" min={1} value={a.quantity ?? 100} onChange={e=>setA({...a, quantity: Number(e.target.value)})} />
      </section>

      <footer>
        <button disabled={!a.target} onClick={()=>onRecommend(a)}>推奨タグを表示</button>
      </footer>

      <style jsx>{`
        .wizard { max-width: 840px; margin: 0 auto; padding: 16px; }
        .chips button { margin: 4px; padding: 6px 10px; border-radius: 8px; border: 1px solid #ddd; }
        .active { background: #2563eb; color: #fff; }
        section { margin: 14px 0; }
        .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        input, select { padding: 6px; border: 1px solid #ccc; border-radius: 6px; }
        .chk { display: flex; gap: 6px; align-items: center; }
        footer { margin-top: 16px; }
        small { color: #6b7280; }
      `}</style>
    </div>
  );
}
