import { For, createSignal, onMount } from 'solid-js'
import Collection from '~/components/ComponentList'
import SearchBar from '~/components/SearchBar'
import { categories, filterComponents } from '~/data'
import type { ComponentInfo } from '~/data/types'

export default function Home() {
  const [components, setComponents] = createSignal<ComponentInfo[]>([])
  const handleSearch = async (value: string) => {
    const res = await filterComponents(value)
    setComponents(res)
  }

  onMount(() => {
    handleSearch('')
  })
  return (
    <div class="flex pt-12 relative flex-grow">
      <div class="flex h-screen w-full">
        <div class="max-w-1200px w-full mx-auto">
          <div class="md:mx-6 md:my-6">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div class="flex container md:mx-6 md:my-6">
            <div class="absolute z-20 left-0 h-full lg:static lg:w-3/12">
              <div class="text-lg op-60">Filter</div>
              <div class="py-4">
                <For each={categories}>
                  {(item) => (
                    <button class="mb2 flex items-center w-full text-sm px-4 py-2 min-h-[50px] text-left border border-base color-base hover:shadow">
                      <span class="c-gray-500">{item.name}</span>
                      <span class="ml-auto text-center text-gray-400 text-xs">{item.count}</span>
                    </button>
                  )}
                </For>
              </div>
            </div>
            <div class="w-full lg:w-9/12">
              <Collection components={components()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
