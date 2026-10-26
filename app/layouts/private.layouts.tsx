import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from 'tessera-ui'
import { useRequestInfo } from '@/hooks/useRequestInfo'
import { ROUTE_PATH as THEME_PATH } from '@/routes/resources/update-theme'
import { SITE_CONFIG } from '@/utils/config/site.config'
import { ClipboardClock, Settings2, SquareCheckBig } from 'lucide-react'
import { Outlet, useNavigate, useSubmit } from 'react-router'
import { Layout, MainItemProps } from 'tessera-ui'

export function loader() {
  const identiesApiUrl = process.env.IDENTIES_API_URL

  return {
    identiesApiUrl,
  }
}

export default function PrivateLayout() {
  const { isLoadingIdenties } = useApp()
  const requestInfo = useRequestInfo()
  const submit = useSubmit()
  const navigate = useNavigate()
  const shouldCollapseSidebar = Boolean(false)

  const onSetTheme = (theme: string) => {
    submit(
      { theme },
      {
        method: 'POST',
        action: THEME_PATH,
        navigate: false,
        fetcherKey: 'theme-fetcher',
      }
    )
  }
  const menuItems: MainItemProps[] = [
    {
      title: 'Features',
      path: `/features`,
      icon: Settings2,
    },
    {
      title: 'Logs',
      path: `/audit-logs`,
      icon: ClipboardClock,
    },
    {
      title: 'Feature Test',
      path: `/features-check`,
      icon: SquareCheckBig,
    },
  ]

  if (isLoadingIdenties) {
    return <AppPreloader className="min-h-screen" />
  }

  return (
    <Layout.Main menuItems={menuItems} collapseSidebar={shouldCollapseSidebar}>
      <Layout.Header
        title={SITE_CONFIG.siteTitle}
        actionLogout={() => navigate('/logout')}
        actionProfile={() => {}}
        onSetTheme={(theme) => onSetTheme(theme)}
        selectedTheme={requestInfo.userPrefs.theme || 'system'}
      />
      <Outlet />
    </Layout.Main>
  )
}
