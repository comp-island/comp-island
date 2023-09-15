export type Framework = 'vue' | 'react' | 'angular' | 'svelte' | 'vanilla'
export type Category = 'framework' | 'table' | 'pagination'
export type Device = 'responsive' | 'mobile' | 'desktop'
export interface ComponentInfo {
  id: number
  name: string
  author: string
  authorUrl?: string
  authorAvatar: string
  defaultBranch?: string
  repository: string
  homepage: string
  description: string
  language: string
  license: string
  openIssues: number
  stars: number
  topics?: string[]
  createAt: string
  updateAt: string
  category: Category
  framework: Framework[]
  device?: Device[]
}

export interface RepoInfo {
  category?: string
  repository: string
  framework: Framework[]
}

export interface CategoryInfo {
  name: string
  count: number
  icon?: string
  description?: string
}
