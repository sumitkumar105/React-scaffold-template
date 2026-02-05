import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@shared/components'
import { HomePage } from '@features/home'
import { AboutPage } from '@features/about'
import { NotFoundPage } from '@shared/components'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
