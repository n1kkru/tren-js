export const tabsExamples = () => {
  const tabs = window.frontApi.tabs

  document.querySelector('#tabs-init')?.addEventListener('click', () => {
    tabs.init('[data-tabs="example-tabs"]')
  })

  document.querySelector('#tabs-init-all')?.addEventListener('click', () => {
    tabs.initAll()
  })

  document.querySelector('#tabs-set-active')?.addEventListener('click', () => {
    tabs.setActive('[data-tabs="example-tabs"]', 1)
  })

  document.querySelector('#tabs-get-active')?.addEventListener('click', () => {
    const active = tabs.getActive('[data-tabs="example-tabs"]')
    console.log('[Active tab]', active)
  })

  document.querySelector('#tabs-reinit')?.addEventListener('click', () => {
    tabs.reinit('[data-tabs="example-tabs"]', {
      lazy: true
    })
  })

  document.querySelector('#tabs-log-instances')?.addEventListener('click', () => {
    console.log('[Instances]', tabs.instances)
  })

  tabs.onAnyInit(tabs => {
    console.log('[Init]', tabs)
  })

  tabs.onAnyChange(({ activeTab, prevTab }) => {
    console.log('[Change]', activeTab.id, 'from', prevTab?.id)
  })
}
