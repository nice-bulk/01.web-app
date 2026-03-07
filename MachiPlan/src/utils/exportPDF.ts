import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TourPlan } from '../types/plan';

export async function exportToPDF(plan: TourPlan): Promise<void> {
  const element = document.getElementById('tour-plan-result');
  if (!element) throw new Error('出力対象の要素が見つかりません');

  const originalBg = element.style.background;
  element.style.background = '#FAF6EF';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FAF6EF',
      logging: false,
    });

    element.style.background = originalBg;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

    const pageW = pdf.internal.pageSize.getWidth();   // pt
    const pageH = pdf.internal.pageSize.getHeight();  // pt
    const margin = 28; // pt
    const contentW = pageW - margin * 2;

    // canvas px → pt 変換比率
    const scale = contentW / canvas.width;
    const totalH = canvas.height * scale; // コンテンツ全体の高さ (pt)
    const sliceH = pageH - margin * 2;    // 1ページに入る高さ (pt)

    // --- カードの境界線をpt単位で収集 ---
    // timeline-card クラスを持つ要素の top/bottom を取得
    const containerRect = element.getBoundingClientRect();
    // timeline-item 全体（ドット＋カード）を区切りの基準にする
    const cards = element.querySelectorAll<HTMLElement>('.timeline-item');
    const pxToPt = (canvas.width / (containerRect.width * 2)) * scale;
    const cardBounds: { top: number; bottom: number }[] = Array.from(cards).map(card => {
      const r = card.getBoundingClientRect();
      const top    = (r.top    - containerRect.top) * pxToPt;
      const bottom = (r.bottom - containerRect.top) * pxToPt;
      return { top, bottom };
    });

    /**
     * ページ分割位置を決める。
     * 単純に sliceH ずつ切るのではなく、カードの途中にならないよう
     * 切断位置をカードとカードの間（gap）に調整する。
     */
    const breakPoints: number[] = [0]; // コンテンツ先頭
    let cursor = 0;

    while (cursor + sliceH < totalH) {
      const rawBreak = cursor + sliceH; // 理想的な切断位置 (pt)

      // rawBreak がいずれかのカード内部に入っていたら、そのカードの top に切り上げ
      let adjusted = rawBreak;
      for (const { top, bottom } of cardBounds) {
        if (rawBreak > top && rawBreak < bottom) {
          // カードの中で切れる → カードの直前で切る
          adjusted = top - 8; // 少し余白を持たせる
          break;
        }
      }

      // adjusted が cursor と同じかそれ以下なら（カードが1ページより大きい）強制で進める
      if (adjusted <= cursor) adjusted = rawBreak;

      breakPoints.push(adjusted);
      cursor = adjusted;
    }

    // --- 各ページを描画 ---
    breakPoints.forEach((startPt, i) => {
      if (i > 0) pdf.addPage();

      const endPt = i + 1 < breakPoints.length ? breakPoints[i + 1] : totalH;
      const slicePtH = endPt - startPt;

      // canvas上のピクセル座標
      const srcY  = startPt / scale;
      const srcH  = slicePtH / scale;

      // 該当スライスだけ切り出す offscreen canvas
      const slice = document.createElement('canvas');
      slice.width  = canvas.width;
      slice.height = Math.ceil(srcH);
      const ctx = slice.getContext('2d')!;
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

      pdf.addImage(
        slice.toDataURL('image/png'),
        'PNG',
        margin,
        margin,
        contentW,
        slicePtH,
      );
    });

    pdf.save(`${plan.town}_観光プラン.pdf`);
  } catch (e) {
    element.style.background = originalBg;
    throw e;
  }
}
