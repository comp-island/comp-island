import { Octokit } from 'octokit'
import fs from 'fs-extra'
import eslint from 'eslint'
import fg from 'fast-glob'
import type { Category, ComponentInfo, Framework, RepoInfo } from '~/data/types'

const formatModules = async (_modules: string[], result: RepoInfo[]) => {
  for (const key of _modules) {
    const path = key.replace('./src', '~')
    const category = path.split('/')[3].split('.')[0]
    try {
      const module = await import(path)
      const defaultModule = module.default
      if (defaultModule) {
        const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
        const objList = defaultModule as RepoInfo[]
        objList.forEach((obj) => {
          obj.category = category as Category
        })
        result.push(...moduleList)
      }
    } catch (error) {
      console.error(`Error importing module at path: ${path}`, error)
    }
  }
  return result
}

async function fetchRepositories(repos: RepoInfo[]) {
  const octokit = new Octokit()
  const promises = repos.map((r) => {
    const [owner, repo] = r.repository.split('/').slice(-2)
    return octokit.rest.repos.get({
      owner,
      repo,
    })
  })

  const responses = await Promise.all(promises)
  const repositories = responses.map((response) => response.data)
  return repositories
}

async function run() {
  const gh = new Octokit()
  const components: ComponentInfo[] = []
  const modulePaths = fg.sync(['./src/data/repos/*.ts'])
  const repos = await formatModules(modulePaths, [])
  const result = await fetchRepositories(repos)
  console.log(result)
  return
  for (const r of repos) {
    const [owner, repo] = r.repository.split('/').slice(-2)
    const { data } = await gh.rest.repos.get({
      owner,
      repo,
    })
    components.push({
      id: data.id,
      name: data.name,
      author: data.owner.login,
      authorAvatar: data.owner.avatar_url,
      authorUrl: data.owner.html_url,
      topics: data.topics,
      category: r.category as Category,
      framework: r.framework as Framework[],
      repository: r.repository,
      defaultBranch: data.default_branch,
      homepage: data.homepage || '',
      description: data.description || '',
      language: data.language || '',
      license: data.license?.name || '',
      openIssues: data.open_issues_count,
      stars: data.stargazers_count,
      createAt: data.created_at,
      updateAt: data.updated_at,
    })
  }
  // path: src/data/components.ts
  const final = `/* eslint-disable prettier/prettier */\n\n// DO NOTE EDIT THIS FILE, IT IS GENERATED AUTOMATICALLY \n\nimport type { ComponentInfo } from './types'\n\nexport const components: ComponentInfo[] = ${JSON.stringify(
    components,
    null,
    2,
  )}\n`
  // run eslint fix command
  const linter = new eslint.ESLint({
    fix: true,
  })
  const results = await linter.lintText(final)
  await eslint.ESLint.outputFixes(results)
  await fs.writeFile('src/data/components.ts', results[0].output!, 'utf-8')
  console.info('update components successfully!')
}

run()
