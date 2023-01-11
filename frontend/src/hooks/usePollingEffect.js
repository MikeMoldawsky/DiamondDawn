import React, { useEffect, useRef } from "react"

const usePollingEffect = (
  asyncCallback,
  dependencies = [],
  {
    interval = 10_000, // 10 seconds,
    onCleanUp = () => {},
    stopPolling = false,
  } = {},
) => {
  const timeoutIdRef = useRef(null)
  useEffect(() => {
    if (stopPolling) return;

    let _stopped = false
      // Side note: preceding semicolon needed for IIFEs.
    ;(async function pollingCallback() {
      try {
        await asyncCallback()
      } finally {
        // Set timeout after it finished, unless stopped
        timeoutIdRef.current = !_stopped && setTimeout(
          pollingCallback,
          interval
        )
      }
    })()
    // Clean up if dependencies change
    return () => {
      _stopped = true // prevent racing conditions
      clearTimeout(timeoutIdRef.current)
      onCleanUp()
    }
  }, [...dependencies, interval, stopPolling])
}

export default usePollingEffect