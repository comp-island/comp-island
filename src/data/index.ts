import { AsyncFzf } from 'fzf'

import { components } from './components'
import type { Category, CategoryInfo, RepoInfo } from './types'

const modules = import.meta.glob('./repos/*.ts', { eager: true })

const formatModules = (_modules: any, result: RepoInfo[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default
    if (!defaultModule) return
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    result.push(...moduleList)
  })
  return result
}

const formatCategories = (_modules: any, result: CategoryInfo[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default
    if (!defaultModule) return
    const fileName = key.split('/')[2].split('.')[0]
    const name = fileName.charAt(0).toUpperCase() + fileName.slice(1)
    result.push({
      name,
      count: _modules[key].default.length,
    })
  })
  return result
}
const fzf = new AsyncFzf(components, {
  casing: 'case-insensitive',
  fuzzy: 'v1',
  // support name, category, framework, description
  selector: (v) => `${v.name} ${v.category} ${v.framework} ${v.description}`,
})

export const repos: RepoInfo[] = formatModules(modules, [])

export const categories: CategoryInfo[] = formatCategories(modules, [])

export const repoTypes = () => {
  const result: Category[] = []

  return result
}

export const filterComponents = async (q: string) => {
  if (!q) return components
  const trimmed = q.trim()
  const result = await fzf.find(trimmed)
  return result.map((i) => i.item)
}

export const fileterComponentByID = (id: number) => {
  return components.find((i) => i.id === id)
}
