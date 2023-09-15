/* eslint-disable unicorn/better-regex */
import type { RepoInfo } from '~/data/types'

async function fetchVueComponents(mdRegex: RegExp) {
  console.log('fetching vue components...')
  const proxyURL = 'https://ghproxy.com/'
  const url = `${proxyURL}https://raw.githubusercontent.com/vuejs/awesome-vue/master/README.md`
  const response = await fetch(url)
  let text = ''
  if (response.ok) {
    text = await response.text()
  }
  // console.log(text)
  // 获取 "#### Responsive" 到 "#### Mobile" 之间的内容
  const mdMatch = text.match(mdRegex)
  if (!mdMatch) {
    console.log('未找到匹配的内容')
    process.exit(1)
  }
  const content = mdMatch[1]
  // eg: - [Prefect Design](https://prefect-design.netlify.app/) - Component library using Vue 3, Typescript & Tailwind.
  // 按行循环获取括号内的内容 如：https://prefect-design.netlify.app/
  const contentArr = content.split('\n')
  const repos: RepoInfo[] = []
  const noValidRepos: string[] = []
  for (let line of contentArr) {
    line = line.trim()
    const regex = /\((.*?)\)/
    const match = line.match(regex)
    if (match) {
      const url = match[1]
      // 只保存包含 `https://github.com`的地址
      const githubRegex = /https:\/\/github.com/
      const githubMatch = url.match(githubRegex)
      if (githubMatch) {
        repos.push({
          framework: ['vue'],
          repository: url,
        })
      } else {
        noValidRepos.push(url)
      }
    }
  }
  console.log(repos)
}

// const frameworkRegex = /#### Responsive([\s\S]*?)#### Mobile/
const tableRegex = /#### Table([\s\S]*?)#### Notification/
fetchVueComponents(tableRegex)
