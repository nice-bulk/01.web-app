import { TAGS } from '../data/songs'
import type { TagCategory } from '../types'

type Props = {
  selectedTag: string | null
  onSelect: (tagId: string) => void
}

const CATEGORY_ORDER: TagCategory[] = ['落ち込み', '前向き', 'モヤモヤ', '穏やか', 'テンション']

const CATEGORY_COLOR: Record<TagCategory, string> = {
  '落ち込み': '#7c6aff',
  '前向き': '#ff7c6a',
  'モヤモヤ': '#6ab8ff',
  '穏やか': '#6aff9e',
  'テンション': '#ffd76a',
}

export function TagSelector({ selectedTag, onSelect }: Props) {
  return (
    <div className="tag-selector">
      {CATEGORY_ORDER.map(category => {
        const tags = TAGS.filter(t => t.category === category)
        const color = CATEGORY_COLOR[category]
        return (
          <div key={category} className="tag-group">
            <span className="tag-category-label" style={{ color }}>
              {category}
            </span>
            <div className="tag-list">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className={`tag-btn ${selectedTag === tag.id ? 'active' : ''}`}
                  style={selectedTag === tag.id ? { borderColor: color, color } : {}}
                  onClick={() => onSelect(tag.id)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
