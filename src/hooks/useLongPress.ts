import { useCallback, useRef } from 'react'

export const useLongPress = (
  onLongPress: (e: any) => void,
  onClick: (e: any) => void,
  { delay = 500 } = {},
) => {
  const timeout = useRef<NodeJS.Timeout>()
  const target = useRef<EventTarget>()
  const isLongPress = useRef(false)

  const start = useCallback(
    (event: any) => {
      isLongPress.current = false
      target.current = event.target
      timeout.current = setTimeout(() => {
        isLongPress.current = true
        onLongPress(event)
      }, delay)
    },
    [onLongPress, delay],
  )

  const clear = useCallback(
    (event: any, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current)
      if (shouldTriggerClick && !isLongPress.current) {
        onClick(event)
      }
      isLongPress.current = false
    },
    [onClick],
  )

  return {
    onPointerDown: start,
    onPointerUp: clear,
    onPointerLeave: (e: any) => clear(e, false),
    onContextMenu: (e: any) => e.preventDefault(),
  }
}
