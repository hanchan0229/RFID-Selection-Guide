
export default function ResultCard({ item }: { item: any }) {
  return (
    <div className="card">
      <h3>{item.name} <small>（スコア {item.score}）</small></h3>
      <ul>
        <li>周波数帯: {item.band}</li>
        <li>オンメタル: {item.on_metal ? "対応":"非対応"}</li>
        <li>サイズ: {item.size_mm.join("×")} mm</li>
        <li>読取距離(最大): {item.read_range_m[1]} m</li>
        <li>温度範囲: {item.temp[0]}〜{item.temp[1]} ℃</li>
        {item.ip && <li>IP等級: {item.ip}</li>}
        <li>コスト帯: {item.unit_cost_tier}</li>
      </ul>
      <p className="reasons">{item.reasons?.join(" / ")}</p>
      {item.notes && <p className="notes">備考: {item.notes}</p>}
      <style jsx>{`
        .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; margin-bottom: 12px; background: #fff; }
        h3 { margin: 0 0 8px 0; }
        .reasons { color: #374151; font-size: 0.9rem; }
        .notes { color: #6b7280; font-size: 0.85rem; }
      `}</style>
    </div>
  );
}
