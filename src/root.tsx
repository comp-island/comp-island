// @refresh reload
import { Suspense } from 'solid-js'
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title } from 'solid-start'
import 'uno.css'
import '@unocss/reset/tailwind.css'
import './root.css'

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>组件岛</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-base color-base">
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
