import { useAsync } from 'react-use'

export const Demo = ({ url }) => {
  const state = useAsync(async () => {
    const response = await fetch(url)
    const result = await response.text()
    return result
  }, [url])

  return (
    <div>
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div>Error: {state.error.message}</div>
      ) : (
        <div>Value: {state.value}</div>
      )}
    </div>
  )
}
