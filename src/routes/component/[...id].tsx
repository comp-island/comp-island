import { For, Show, createSignal, onMount } from 'solid-js'
import { Title, useParams } from 'solid-start'
import Giscus from '~/components/Giscus'
import { fetchRaw } from '~/api/repo'
import Markdown from '~/components/Markdown'
import { fileterComponentByID } from '~/data'
import type { ComponentInfo } from '~/data/types'

export default function () {
  const params = useParams()
  const [readMe, setReadMe] = createSignal('')
  const [changeLog, setChangeLog] = createSignal('')
  const [info, setInfo] = createSignal<ComponentInfo>()
  const [activeTab, setActiveTab] = createSignal(1)
  const tabs = [
    {
      id: 1,
      name: 'Readme',
      icon: 'i-carbon-document',
    },
    {
      id: 2,
      name: 'Changelog',
      icon: 'i-carbon-change-catalog',
    },
    {
      id: 3,
      name: 'Discussions',
      icon: 'i-carbon-change-catalog',
    },
  ]

  const handleTabChanged = (id: number) => {
    setActiveTab(id)
  }
  // TODO 404
  const fetchInfo = async () => {
    const [owner, repo] = info()?.repository?.split('/').slice(-2) || []
    const readMeStr = await fetchRaw(owner, repo, info()?.defaultBranch || 'main', 'README.md')
    const changeLogStr = await fetchRaw(owner, repo, info()?.defaultBranch || 'main', 'CHANGELOG.md')
    setReadMe(readMeStr)
    setChangeLog(changeLogStr)
  }
  onMount(() => {
    setInfo(fileterComponentByID(+params.id))
    fetchInfo()
  })
  return (
    <div class="px-6 max-w-1200px mx-auto md:px-0 w-full">
      <Title>{`${info()?.author}/${info()?.name}`}</Title>
      {/* <button onClick={goBack}>Go back</button> */}
      <header class="overflow-hidden pt-6 pb-6 md:pt-12">
        <h2 class="max-w-full no-underline mt3 m-0 text-[3rem] w-full justify-start items-center flex">
          <span class="font-semibold truncate mb-2">{info()?.name}</span>
          <div>
            <a href="#" class="flex">
              <span class="text-sm ml-3">{info()?.category}</span>
            </a>
          </div>
        </h2>
        <span class="text-nowrap text-sm py-.5 font-400 mb-.5">2.3.0 &nbsp;•&nbsp;</span>
        <span class="text-nowrap text-sm py-.5 c-green-6 font-400 mb-.5">Public &nbsp;•&nbsp;</span>
        <span class="text-nowrap text-sm py-.5 font-400 mb-.5">Updated 8 months ago</span>
        <ul class="flex p0" role="tablist">
          <For each={tabs}>
            {(item) => (
              <li
                class={`${
                  activeTab() === item.id ? 'border-opacity-90' : 'border-opacity-0'
                } relative inline-flex text-sm font-sans transition leading-snug items-center bg-slate-500 bg-opacity-0 hover:bg-opacity-5 overflow-hidden border-green-6 dark:border-gray-200 border-b-2 dark:border-opacity-0 dark:hover:border-opacity-10`}
                role="tab"
                id={`${item.id}`}
                onClick={() => handleTabChanged(item.id)}
              >
                <button type="button" class="w-full -mb-0.5 my-12px mx-15px py-2 text-xl">
                  {item.name}
                </button>
              </li>
            )}
          </For>
        </ul>
      </header>
      <main class="prose m-auto dark:prose-invert pb-10">
        <Show when={activeTab() === 1}>
          <Markdown content={readMe()} />
        </Show>
        <Show when={activeTab() === 2}>
          <Markdown content={changeLog()} />
        </Show>
        <Show when={activeTab() === 3}>
          <Giscus
            id="comments"
            repo="comp-island/giscus"
            repoId="R_kgDOKTcTvw"
            category="General"
            categoryId="DIC_kwDOKTcTv84CZTEU"
            mapping="title"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme="light"
            lang="zh-CN"
            loading="lazy"
          />
        </Show>
      </main>
    </div>
  )
}
