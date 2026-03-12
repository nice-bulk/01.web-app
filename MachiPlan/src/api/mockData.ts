import type { TourPlan } from '../types/plan';

/**
 * デモ用モックデータ生成
 * APIキーがない環境でもアプリを体験できるようにするためのデータ
 */

const MOCK_PLANS: Record<string, TourPlan> = {
  京都: {
    town: '京都',
    budget: 10000,
    totalCost: 9450,
    summary:
      '歴史と文化が息づく京都を満喫した一日。早朝の伏見稲荷から始まり、金閣寺や嵐山を経て、夜は祇園の居酒屋でシメ。歩数計はきっと2万歩を超えているはず！',
    spots: [
      {
        time: '08:00〜09:30',
        name: '伏見稲荷大社',
        category: 'sightseeing',
        description:
          '朱色の千本鳥居が連なる京都屈指のパワースポット。早朝は人が少なくフォトジェニックな写真が撮りやすい。山頂まで往復すると約2時間かかる。',
        cost: 0,
        costNote: '入場無料',
        transport: '出発地からJR奈良線で稲荷駅へ（約15分）',
        rating: 5,
        review: '早朝の鳥居は幻想的で感動！外国人観光客も多いけど朝一番なら空いてます。',
        isMeal: false,
      },
      {
        time: '10:00〜11:30',
        name: '金閣寺（鹿苑寺）',
        category: 'sightseeing',
        description:
          '金色に輝く舎利殿は京都観光の象徴。鏡湖池に映り込む姿は絶景で、どの季節に訪れても美しい。周辺の庭園も見ごたえ十分。',
        cost: 500,
        costNote: '拝観料 ¥500',
        transport: '市バスで約40分（金閣寺道バス停下車）',
        rating: 5,
        review: 'やっぱり金ピカは圧巻！混んでるけど見る価値あり。',
        isMeal: false,
      },
      {
        time: '12:00〜13:00',
        name: '湯豆腐 嵯峨野',
        category: 'lunch',
        description:
          '嵐山エリアで人気の老舗湯豆腐専門店。京豆腐の繊細な味わいを懐石スタイルで楽しめる。窓から見える庭園も情緒たっぷり。',
        cost: 1800,
        costNote: '湯豆腐定食 ¥1,800',
        transport: '嵐電で嵐山駅へ（約25分）',
        rating: 4,
        review: '豆腐がとろとろで絶品。量が少し物足りないけど雰囲気最高！',
        isMeal: true,
      },
      {
        time: '13:30〜15:00',
        name: '嵐山・竹林の小径',
        category: 'sightseeing',
        description:
          '大きな竹が空を覆う幻想的な竹林の道。天龍寺から野宮神社へと続く約200mのルートは、京都随一のフォトスポット。',
        cost: 0,
        costNote: '無料（天龍寺庭園は別途 ¥500）',
        transport: '嵐山駅から徒歩5分',
        rating: 4,
        review: 'SNS映え抜群！でも昼間は激混みなので覚悟が必要。',
        isMeal: false,
      },
      {
        time: '15:30〜16:30',
        name: '祇園四条エリア散策',
        category: 'shopping',
        description:
          '舞妓さんに出会えることも。石畳の路地に和雑貨店や京菓子屋が並ぶ風情ある街並み。お土産探しにも最適なエリア。',
        cost: 1500,
        costNote: 'お土産・買い物代（目安）',
        transport: '市バスで祇園バス停へ（約30分）',
        rating: 4,
        review: '八坂神社も近くていい雰囲気。舞妓さんを見かけてテンション上がった！',
        isMeal: false,
      },
      {
        time: '16:45〜17:15',
        name: '八坂神社',
        category: 'sightseeing',
        description:
          '祇園祭で有名な京都有数の神社。夕暮れ時の朱塗りの楼門は特に美しく、境内には多くの末社も点在している。',
        cost: 0,
        costNote: '参拝無料',
        transport: '祇園から徒歩3分',
        rating: 4,
        review: '夕方の光がきれいで写真映え。境内が広くて見どころ多い。',
        isMeal: false,
      },
      {
        time: '18:30〜20:00',
        name: '祇園 居酒屋「花街」',
        category: 'dinner',
        description:
          '京野菜や湯葉、鴨ロースなど京都らしい食材を使った創作和食が楽しめる居酒屋。地酒の品揃えも豊富で旅の締めくくりに最適。',
        cost: 3500,
        costNote: '夕食（飲み物込み） ¥3,500',
        transport: '八坂神社から徒歩5分',
        rating: 5,
        review: '京野菜の天ぷらが絶品！地酒もすすんで気づいたら3杯飲んでた。',
        isMeal: true,
      },
    ],
  },
  函館: {
    town: '函館',
    budget: 12000,
    totalCost: 11200,
    summary:
      '異国情緒漂う函館を一日で満喫。朝市でイカ刺し体験から始まり、元町の洋館巡り、そして世界三大夜景をバックに贅沢な夕食で締めくくる完璧な旅程。',
    spots: [
      {
        time: '07:30〜09:00',
        name: '函館朝市',
        category: 'sightseeing',
        description:
          '新鮮な海鮮が並ぶ函館名物の朝市。生きたイカを自分で釣って刺身にしてもらえる「活いか釣り堀」が人気。早朝から活気に満ちている。',
        cost: 1500,
        costNote: 'いか釣り+刺身代 ¥1,500',
        transport: '函館駅から徒歩3分',
        rating: 5,
        review: '自分で釣ったイカを食べる体験は最高！透明なイカ刺しが信じられないくらい甘い。',
        isMeal: false,
      },
      {
        time: '09:30〜10:00',
        name: '朝食：海鮮丼（朝市内）',
        category: 'lunch',
        description:
          'ウニ・イクラ・カニがのった豪華な海鮮丼。函館の朝市内には複数の食堂があり、新鮮さと値段のバランスが抜群。',
        cost: 1800,
        costNote: '海鮮丼 ¥1,800',
        transport: '朝市内移動',
        rating: 5,
        review: 'ウニとイクラの甘さが別格！東京で食べる半分の値段でこのクオリティは反則。',
        isMeal: true,
      },
      {
        time: '10:30〜12:30',
        name: '元町洋館エリア',
        category: 'sightseeing',
        description:
          '函館山のふもとに広がる異国情緒たっぷりのエリア。旧函館区公会堂や東本願寺函館別院など、明治時代の洋館が立ち並ぶ。坂道からの海の景色も絶景。',
        cost: 300,
        costNote: '旧函館区公会堂 見学料 ¥300',
        transport: '市電で末広町停留所へ（約10分）',
        rating: 4,
        review: '函館のヨーロッパ！坂道歩きは疲れるけど景色最高。カフェで休憩しながら巡るのがオススメ。',
        isMeal: false,
      },
      {
        time: '13:00〜14:00',
        name: 'カフェ「ティーショップ明治館」',
        category: 'cafe',
        description:
          '明治時代の郵便局を改装したレトロな雰囲気のカフェ。函館スイーツを楽しみながら休憩できる。',
        cost: 800,
        costNote: 'コーヒー+スイーツセット ¥800',
        transport: '元町から徒歩5分',
        rating: 4,
        review: '建物が素敵すぎる。レトロな雰囲気でゆっくりできた。',
        isMeal: false,
      },
      {
        time: '14:30〜16:00',
        name: '五稜郭公園・五稜郭タワー',
        category: 'sightseeing',
        description:
          '幕末の歴史舞台となった星形の城郭。タワーからは五稜郭の全体像を一望できる。春は桜の名所としても有名。',
        cost: 900,
        costNote: '五稜郭タワー展望台 ¥900',
        transport: '市電で五稜郭公園前停留所へ（約15分）',
        rating: 4,
        review: '上から見る五稜郭の形がカッコいい！歴史の勉強にもなる。',
        isMeal: false,
      },
      {
        time: '18:00〜19:00',
        name: '函館山ロープウェイ・夜景鑑賞',
        category: 'sightseeing',
        description:
          '世界三大夜景のひとつとも称される函館の夜景。山頂からの100万ドルの夜景は息をのむ美しさ。日没後30分が最も美しい時間帯。',
        cost: 1500,
        costNote: 'ロープウェイ往復 ¥1,500',
        transport: '元町エリアからロープウェイ山麓駅へ徒歩15分',
        rating: 5,
        review: '言葉を失う美しさ。防寒対策は必須！山頂は風が強く寒い。',
        isMeal: false,
      },
      {
        time: '19:30〜21:00',
        name: '夕食：海鮮居酒屋「漁火」',
        category: 'dinner',
        description:
          '函館港を眺めながら新鮮な海鮮料理が楽しめる居酒屋。ホッケの開き、毛ガニ、塩辛など北海道の幸が勢揃い。',
        cost: 3500,
        costNote: '夕食+飲み物 ¥3,500',
        transport: 'ロープウェイ山麓駅から徒歩10分',
        rating: 5,
        review: 'ホッケのサイズに驚いた！脂がのってて最高。函館の夜を満喫できた。',
        isMeal: true,
      },
    ],
  },
};

/** デフォルトのモックプラン（町名がDBにない場合） */
function generateDefaultMockPlan(town: string, budget: number): TourPlan {
  const totalCost = Math.floor(budget * 0.92);
  return {
    town,
    budget,
    totalCost,
    summary: `${town}の魅力を余すことなく体験した充実の一日。歴史的な名所から地元グルメまで、バランスよく楽しめるプランです。ぜひ実際に訪れてみてください！`,
    spots: [
      {
        time: '09:00〜10:30',
        name: `${town}の名所・旧跡`,
        category: 'sightseeing',
        description: `${town}を代表する歴史的な観光スポット。地域の文化や歴史を感じながら散策できる。ガイドツアーもあり深く学べる。`,
        cost: Math.floor(budget * 0.05),
        costNote: `入場料 ¥${Math.floor(budget * 0.05).toLocaleString()}`,
        transport: '出発地から電車・バスで約20分',
        rating: 4,
        review: '地元の歴史が学べて充実した時間でした。',
        isMeal: false,
      },
      {
        time: '11:00〜12:00',
        name: `${town}中心部 散策`,
        category: 'shopping',
        description: `${town}の商店街や市場エリア。地元の特産品やお土産を探しながらのんびり歩ける。地元の人との交流も楽しみのひとつ。`,
        cost: Math.floor(budget * 0.12),
        costNote: 'お土産・買い物代（目安）',
        transport: '前スポットから徒歩15分',
        rating: 3,
        review: 'ローカルな雰囲気が好き。掘り出し物が見つかった！',
        isMeal: false,
      },
      {
        time: '12:30〜13:30',
        name: `地元食堂「${town}の味」`,
        category: 'lunch',
        description: `${town}ならではの郷土料理が楽しめる地元で人気の食堂。新鮮な地元食材を使った定食は観光客にも大人気。`,
        cost: Math.floor(budget * 0.15),
        costNote: `ランチ定食 ¥${Math.floor(budget * 0.15).toLocaleString()}`,
        transport: '前スポットから徒歩10分',
        rating: 4,
        review: '地元の味が最高！また来たいと思えるお店でした。',
        isMeal: true,
      },
      {
        time: '14:00〜15:30',
        name: `${town}の自然・公園`,
        category: 'sightseeing',
        description: `${town}の自然を満喫できる公園や自然エリア。四季折々の風景が楽しめ、地元住民の憩いの場でもある。`,
        cost: 0,
        costNote: '入場無料',
        transport: 'バスで約15分',
        rating: 4,
        review: '自然の中でリフレッシュできた。景色がとても綺麗！',
        isMeal: false,
      },
      {
        time: '16:00〜17:00',
        name: `${town}カフェ・休憩スポット`,
        category: 'cafe',
        description: `地元で人気のカフェ。${town}産の食材を使ったスイーツや飲み物が楽しめる。旅の疲れを癒やす休憩にぴったり。`,
        cost: Math.floor(budget * 0.08),
        costNote: `カフェ代 ¥${Math.floor(budget * 0.08).toLocaleString()}`,
        transport: '前スポットから徒歩10分',
        rating: 4,
        review: 'こだわりのコーヒーと地元スイーツのセットが絶品！',
        isMeal: false,
      },
      {
        time: '18:30〜20:00',
        name: `夕食：${town}の郷土料理レストラン`,
        category: 'dinner',
        description: `${town}の食文化を凝縮した郷土料理が楽しめるレストラン。地酒や地ビールとの相性も抜群で、旅の締めくくりにふさわしい一軒。`,
        cost: Math.floor(budget * 0.32),
        costNote: `夕食（飲み物込み） ¥${Math.floor(budget * 0.32).toLocaleString()}`,
        transport: 'カフェから徒歩15分',
        rating: 5,
        review: `${town}の味を堪能できた最高の夕食！また来たい！`,
        isMeal: true,
      },
    ],
  };
}

export async function mockGenerateTourPlan(
  town: string,
  budget: number,
): Promise<TourPlan> {
  // リアルなローディング体験のため1.5秒待機
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 登録済みの町があればそれを返す（予算は入力値に合わせて調整）
  const preset = MOCK_PLANS[town];
  if (preset) {
    const ratio = budget / preset.budget;
    return {
      ...preset,
      budget,
      totalCost: Math.floor(preset.totalCost * ratio),
      spots: preset.spots.map((spot) => ({
        ...spot,
        cost: Math.floor(spot.cost * ratio),
      })),
    };
  }

  // 未登録の町はデフォルトプランを生成
  return generateDefaultMockPlan(town, budget);
}
