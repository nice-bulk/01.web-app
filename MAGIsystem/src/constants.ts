export const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "重要な決断を迫られたとき、最初に何を基準にしますか？",
    options: [
      { label: "A", text: "データや論理的な分析", value: 0 },
      { label: "B", text: "周囲への影響や倫理観", value: 1 },
      { label: "C", text: "直感や本能的な感覚", value: 2 },
      { label: "D", text: "過去の経験と感情", value: 3 },
    ]
  },
  {
    id: 2,
    text: "あなたにとって「成功」とは何ですか？",
    options: [
      { label: "A", text: "目標を効率的に達成すること", value: 0 },
      { label: "B", text: "誰かの役に立てること", value: 1 },
      { label: "C", text: "自分らしく生きること", value: 2 },
      { label: "D", text: "安心と安定を得ること", value: 3 },
    ]
  },
  {
    id: 3,
    text: "友人があなたに有害なアドバイスを求めてきました。どうしますか？",
    options: [
      { label: "A", text: "事実を率直に伝える", value: 0 },
      { label: "B", text: "相手の気持ちを優先し、やんわり伝える", value: 1 },
      { label: "C", text: "本人が決めるべきだと思い、答えない", value: 2 },
      { label: "D", text: "自分の経験から感情的に訴える", value: 3 },
    ]
  },
  {
    id: 4,
    text: "理想の休日の過ごし方は？",
    options: [
      { label: "A", text: "知識や技術の習得に費やす", value: 0 },
      { label: "B", text: "大切な人と過ごす", value: 1 },
      { label: "C", text: "一人で自由に探索する", value: 2 },
      { label: "D", text: "ゆっくりと体と心を休める", value: 3 },
    ]
  },
  {
    id: 5,
    text: "ルールと直感が衝突したとき、あなたは？",
    options: [
      { label: "A", text: "ルールに従う。秩序は重要だ", value: 0 },
      { label: "B", text: "状況を見て判断する", value: 1 },
      { label: "C", text: "直感に従う。ルールは手段に過ぎない", value: 2 },
      { label: "D", text: "感情の赴くままに行動する", value: 3 },
    ]
  },
  {
    id: 6,
    text: "チームで失敗したとき、あなたの反応は？",
    options: [
      { label: "A", text: "原因を分析し、改善策を提案する", value: 0 },
      { label: "B", text: "チームを励まし、責任を共有する", value: 1 },
      { label: "C", text: "自分の直感が正しかったか振り返る", value: 2 },
      { label: "D", text: "感情的になってしまうが、後で反省する", value: 3 },
    ]
  },
  {
    id: 7,
    text: "あなたが最も恐れるものは何ですか？",
    options: [
      { label: "A", text: "非効率や無駄な時間", value: 0 },
      { label: "B", text: "誰かを傷つけること", value: 1 },
      { label: "C", text: "自由を失うこと", value: 2 },
      { label: "D", text: "孤独や見捨てられること", value: 3 },
    ]
  },
  {
    id: 8,
    text: "未知の状況に直面したとき、あなたは？",
    options: [
      { label: "A", text: "まず情報を収集し、計画を立てる", value: 0 },
      { label: "B", text: "周囲に相談し、協力を求める", value: 1 },
      { label: "C", text: "とにかく飛び込んで経験する", value: 2 },
      { label: "D", text: "慎重に様子を見守る", value: 3 },
    ]
  },
  {
    id: 9,
    text: "あなたの最大の強みは何だと思いますか？",
    options: [
      { label: "A", text: "論理的思考と問題解決能力", value: 0 },
      { label: "B", text: "共感力と人間関係の構築", value: 1 },
      { label: "C", text: "創造性と柔軟な発想", value: 2 },
      { label: "D", text: "感情の深さと直感力", value: 3 },
    ]
  },
  {
    id: 10,
    text: "人生において最も大切にしていることは？",
    options: [
      { label: "A", text: "真実と合理性の追求", value: 0 },
      { label: "B", text: "愛と繋がり", value: 1 },
      { label: "C", text: "自己実現と自由", value: 2 },
      { label: "D", text: "安心と幸福感", value: 3 },
    ]
  },
] as const

export const MAGI_NAMES = {
  melchior: 'MELCHIOR·1',
  balthazar: 'BALTHAZAR·2',
  caspar: 'CASPAR·3',
} as const
