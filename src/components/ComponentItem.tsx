import { For } from 'solid-js'
import { useNavigate } from 'solid-start'
import type { ComponentInfo } from '~/data/types'

interface ComponentItemProps {
  item: ComponentInfo
}

export default function ComponentItem(props: ComponentItemProps) {
  const iconMap: Record<string, string> = {
    vue: 'i-logos-vue',
    react: 'i-logos-react',
    angular: 'i-logos-angular-icon',
    svelte: 'i-logos-svelte-icon',
    flutter: 'i-logos-flutter',
    webpack: 'i-logos-webpack',
  }
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/component/${props.item.id}`)
  }
  return (
    <a
      onClick={handleClick}
      class="cursor-pointer flex flex-col justify-between translate-z-0 items-center gap2 border p-16px transition-all border-base color-base hover:shadow"
    >
      <div class="flex flex-col justify-between w-full h-full">
        <div class="flex justify-between">
          <div class="fcc">
            <div class="i-octicon-repo-24 mr-2 text-14px c-gray-500" />
            <span class="c-blue-500 text-14px">{props.item.name}</span>
            <span class="h-18px lh-18px b b-gray-500 c-gray-500 rd-2em text-12px px-2 ml-2 font-500">
              {props.item.category}
            </span>
          </div>
          <div class="text-12px c-gray-400">{props.item.updateAt.split('T')[0]}</div>
        </div>
        <div class="mt-2 mb-0 flex-1 min-h-40px text-left">
          <p class="c-gray-500 text-12px">{props.item.description}</p>
        </div>
        <div class="flex mt-2 justify-between">
          <div class="fcc c-gray-500">
            <div class="fcc text-12px">
              <div class="i-octicon-star-24 w-16px h-16px mr-1" />
              <span class="lh-10px">{props.item.stars}</span>
            </div>
            <div class="fcc ml-4 text-12px">
              <div class="i-octicon-issue-opened-24 w-16px h-16px mr-1" />
              <span class="lh-10px">{props.item.openIssues}</span>
            </div>
          </div>
          <div class="flex">
            <For each={props.item.framework}>
              {(subItem) => (
                <div class=" transition hover:translate-y--2px mr-2 fcc">
                  <div class={`${iconMap[subItem]} w-14px h-14px`} />
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </a>
  )
}
