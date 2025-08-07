import { createSignal, onMount, onCleanup } from 'solid-js'

declare global {
  interface Window {
    turnstile: any
  }
}

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

export default function CloudflareTurnstile(props: TurnstileProps) {
  let containerRef: HTMLDivElement
  const [widgetId, setWidgetId] = createSignal<string | null>(null)

  onMount(() => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (window.turnstile && containerRef) {
        const id = window.turnstile.render(containerRef, {
          sitekey: props.siteKey,
          callback: (token: string) => {
            props.onVerify(token)
          },
          'expired-callback': () => {
            props.onExpire?.()
          },
          'error-callback': () => {
            props.onError?.()
          },
          theme: 'auto',
          size: 'normal'
        })
        setWidgetId(id)
      }
    }
    
    document.head.appendChild(script)
  })

  onCleanup(() => {
    if (window.turnstile && widgetId()) {
      window.turnstile.remove(widgetId())
    }
  })

  const reset = () => {
    if (window.turnstile && widgetId()) {
      window.turnstile.reset(widgetId())
    }
  }

  return (
    <div>
      <div ref={containerRef!} class="cf-turnstile"></div>
    </div>
  )
}

export const resetTurnstile = () => {
  if (window.turnstile) {
    window.turnstile.reset()
  }
}