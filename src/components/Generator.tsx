import { Index, Show, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { useThrottleFn } from 'solidjs-use'
import { generateSignature } from '@/utils/auth'
import IconClear from './icons/Clear'
import IconX from './icons/X'
import Picture from './icons/Picture'
import MessageItem from './MessageItem'
import ErrorMessageItem from './ErrorMessageItem'
import CloudflareTurnstile from './CloudflareTurnstile'
import type { ChatMessage, ErrorMessage } from '@/types'

export default () => {
  let inputRef: HTMLTextAreaElement
  let turnstileRef: any
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])
  const [currentError, setCurrentError] = createSignal<ErrorMessage>()
  const [currentAssistantMessage, setCurrentAssistantMessage] = createSignal('')
  const [loading, setLoading] = createSignal(false)
  const [controller, setController] = createSignal<AbortController>(null)
  const [isStick, setStick] = createSignal(false)
  const [showComingSoon, setShowComingSoon] = createSignal(false)
  const [turnstileToken, setTurnstileToken] = createSignal<string>('')
  const [turnstileTokenTimestamp, setTurnstileTokenTimestamp] = createSignal<number>(0)
  const [showTurnstile, setShowTurnstile] = createSignal(false)
  const [pendingMessage, setPendingMessage] = createSignal<string>('')
  const maxHistoryMessages = parseInt(import.meta.env.PUBLIC_MAX_HISTORY_MESSAGES || '99')
  const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || ''
  const TURNSTILE_TOKEN_DURATION = 4.5 * 60 * 1000 // 4.5 minutes (slightly less than 5 min expiry)

  createEffect(() => (isStick() && smoothToBottom()))

  onMount(() => {
    let lastPostion = window.scrollY

    window.addEventListener('scroll', () => {
      const nowPostion = window.scrollY
      nowPostion < lastPostion && setStick(false)
      lastPostion = nowPostion
    })

    try {
      if (localStorage.getItem('messageList'))
        setMessageList(JSON.parse(localStorage.getItem('messageList')))

      if (localStorage.getItem('stickToBottom') === 'stick')
        setStick(true)
        
      // Restore Turnstile token if still valid
      const savedToken = localStorage.getItem('turnstileToken')
      const savedTimestamp = localStorage.getItem('turnstileTokenTimestamp')
      if (savedToken && savedTimestamp) {
        const timestamp = parseInt(savedTimestamp)
        if (Date.now() - timestamp < TURNSTILE_TOKEN_DURATION) {
          setTurnstileToken(savedToken)
          setTurnstileTokenTimestamp(timestamp)
        } else {
          // Clear expired token
          localStorage.removeItem('turnstileToken')
          localStorage.removeItem('turnstileTokenTimestamp')
        }
      }
    } catch (err) {
      console.error(err)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    onCleanup(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })
  })

  const handleBeforeUnload = () => {
    localStorage.setItem('messageList', JSON.stringify(messageList()))
    isStick() ? localStorage.setItem('stickToBottom', 'stick') : localStorage.removeItem('stickToBottom')
    
    // Save Turnstile token if still valid
    if (turnstileToken() && Date.now() - turnstileTokenTimestamp() < TURNSTILE_TOKEN_DURATION) {
      localStorage.setItem('turnstileToken', turnstileToken())
      localStorage.setItem('turnstileTokenTimestamp', turnstileTokenTimestamp().toString())
    } else {
      localStorage.removeItem('turnstileToken')
      localStorage.removeItem('turnstileTokenTimestamp')
    }
  }

  const handleButtonClick = async() => {
    const inputValue = inputRef.value
    if (!inputValue)
      return

    // Check if token exists and is still valid
    const tokenAge = Date.now() - turnstileTokenTimestamp()
    if (!turnstileToken() || tokenAge > TURNSTILE_TOKEN_DURATION) {
      // Token doesn't exist or expired, need verification
      setPendingMessage(inputValue)
      setShowTurnstile(true)
      return
    }

    // Process the message with valid token
    inputRef.value = ''
    setMessageList([
      ...messageList(),
      {
        role: 'user',
        content: inputValue,
      },
    ])
    requestWithLatestMessage()
    instantToBottom()
  }

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token)
    setTurnstileTokenTimestamp(Date.now())
    setShowTurnstile(false)
    
    // Save token to localStorage
    localStorage.setItem('turnstileToken', token)
    localStorage.setItem('turnstileTokenTimestamp', Date.now().toString())
    
    // Process pending message if exists
    if (pendingMessage()) {
      const message = pendingMessage()
      setPendingMessage('')
      inputRef.value = ''
      setMessageList([
        ...messageList(),
        {
          role: 'user',
          content: message,
        },
      ])
      requestWithLatestMessage()
      instantToBottom()
    }
  }

  const handleTurnstileExpire = () => {
    setTurnstileToken('')
    setTurnstileTokenTimestamp(0)
    localStorage.removeItem('turnstileToken')
    localStorage.removeItem('turnstileTokenTimestamp')
  }

  const handleTurnstileError = () => {
    setTurnstileToken('')
    setShowTurnstile(false)
    setCurrentError({
      message: 'Turnstile verification failed. Please try again.',
    })
  }

  const smoothToBottom = useThrottleFn(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, 300, false, true)

  const instantToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
  }

  // ? Interim Solution
  // ensure that the user and the model have a one-to-one conversation and avoid any errors like:
  // "Please ensure that multiturn requests ends with a user role or a function response."
  // convert the raw list into data that conforms to the interface api rules
  const convertReqMsgList = (originalMsgList: ChatMessage[]) => {
    return originalMsgList.filter((curMsg, i, arr) => {
      // Check if there is a next message
      const nextMsg = arr[i + 1]
      // Include the current message if there is no next message or if the roles are different
      return !nextMsg || curMsg.role !== nextMsg.role
    })
  }
  const requestWithLatestMessage = async() => {
    setLoading(true)
    setCurrentAssistantMessage('')
    setCurrentError(null)
    const storagePassword = localStorage.getItem('pass')
    try {
      const controller = new AbortController()
      setController(controller)
      const requestMessageList = messageList().map(message => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
      })).slice(-maxHistoryMessages)
      const timestamp = Date.now()
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          messages: convertReqMsgList(requestMessageList),
          time: timestamp,
          pass: storagePassword,
          sign: await generateSignature({
            t: timestamp,
            m: requestMessageList?.[requestMessageList.length - 1]?.parts[0]?.text || '',
          }),
          turnstileToken: turnstileToken(),
        }),
        signal: controller.signal,
      })
      if (!response.ok) {
        const error = await response.json()
        console.error(error.error)
        setCurrentError(error.error)
        throw new Error('Request failed')
      }
      const data = response.body
      if (!data)
        throw new Error('No data')

      const reader = data.getReader()
      const decoder = new TextDecoder('utf-8')
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        if (value) {
          const char = decoder.decode(value, { stream: true })
          if (char === '\n' && currentAssistantMessage().endsWith('\n'))
            continue

          if (char)
            setCurrentAssistantMessage(currentAssistantMessage() + char)

          isStick() && instantToBottom()
        }
        done = readerDone
      }
      if (done)
        setCurrentAssistantMessage(currentAssistantMessage() + decoder.decode())
    } catch (e) {
      console.error(e)
      setLoading(false)
      setController(null)
      return
    }
    archiveCurrentMessage()
    isStick() && instantToBottom()
  }

  const archiveCurrentMessage = () => {
    if (currentAssistantMessage()) {
      setMessageList([
        ...messageList(),
        {
          role: 'assistant',
          content: currentAssistantMessage(),
        },
      ])
      setCurrentAssistantMessage('')
      setLoading(false)
      setController(null)
      // Disable auto-focus on touch devices
      if (!('ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0))
        inputRef.focus()
    }
  }

  const clear = () => {
    inputRef.value = ''
    inputRef.style.height = 'auto'
    setMessageList([])
    setCurrentAssistantMessage('')
    setCurrentError(null)
  }

  const stopStreamFetch = () => {
    if (controller()) {
      controller().abort()
      archiveCurrentMessage()
    }
  }

  const retryLastFetch = () => {
    if (messageList().length > 0) {
      const lastMessage = messageList()[messageList().length - 1]
      if (lastMessage.role === 'assistant')
        setMessageList(messageList().slice(0, -1))
      requestWithLatestMessage()
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.isComposing || e.shiftKey)
      return

    if (e.key === 'Enter') {
      e.preventDefault()
      handleButtonClick()
    }
  }

  const handlePictureUpload = () => {
    // coming soon
    setShowComingSoon(true)
  }

  return (
    <div my-6>
      {/* beautiful coming soon alert box, position: fixed, screen center, no transparent background, z-index 100*/}
      <Show when={showComingSoon()}>
        <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100">
          <div class="bg-white rounded-md shadow-md p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Coming soon</h3>
              <button onClick={() => setShowComingSoon(false)}>
                <IconX />
              </button>
            </div>
            <p class="text-gray-500 mt-2">Chat with picture is coming soon!</p>
          </div>
        </div>
      </Show>

      {/* Turnstile Verification Modal */}
      <Show when={showTurnstile() && turnstileSiteKey}>
        <div class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Please verify you're human</h3>
            <div class="flex justify-center mb-4">
              <CloudflareTurnstile
                ref={turnstileRef}
                siteKey={turnstileSiteKey}
                onVerify={handleTurnstileVerify}
                onExpire={handleTurnstileExpire}
                onError={handleTurnstileError}
              />
            </div>
            <button 
              onClick={() => {
                setShowTurnstile(false)
                setPendingMessage('')
              }}
              class="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Show>

      <Index each={messageList()}>
        {(message, index) => (
          <MessageItem
            role={message().role}
            message={message().content}
            showRetry={() => (message().role === 'assistant' && index === messageList().length - 1)}
            onRetry={retryLastFetch}
          />
        )}
      </Index>
      {currentAssistantMessage() && (
        <MessageItem
          role="assistant"
          message={currentAssistantMessage}
        />
      )}
      {currentError() && <ErrorMessageItem data={currentError()} onRetry={retryLastFetch} />}
      <Show
        when={!loading()}
        fallback={() => (
          <div class="gen-cb-wrapper">
            <span>AI is thinking...</span>
            <div class="gen-cb-stop" onClick={stopStreamFetch}>Stop</div>
          </div>
        )}
      >
        <div class="gen-text-wrapper relative">
          <button title="Picture" onClick={handlePictureUpload} class="absolute left-1rem top-50% translate-y-[-50%]">
            <Picture />
          </button>
          <textarea
            ref={inputRef!}
            onKeyDown={handleKeydown}
            placeholder="Enter something..."
            autocomplete="off"
            autofocus
            onInput={() => {
              inputRef.style.height = 'auto'
              inputRef.style.height = `${inputRef.scrollHeight}px`
            }}
            rows="1"
            class="gen-textarea"
          />
          <button onClick={handleButtonClick} gen-slate-btn>
            Send
          </button>
          <button title="Clear" onClick={clear} gen-slate-btn>
            <IconClear />
          </button>
        </div>
      </Show>
      {/* <div class="fixed bottom-5 left-5 rounded-md hover:bg-slate/10 w-fit h-fit transition-colors active:scale-90" class:stick-btn-on={isStick()}>
        <div>
          <button class="p-2.5 text-base" title="stick to bottom" type="button" onClick={() => setStick(!isStick())}>
            <div i-ph-arrow-line-down-bold />
          </button>
        </div>
      </div> */}
    </div>
  )
}
