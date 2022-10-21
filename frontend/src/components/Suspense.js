import React from 'react'
import {useSelector} from "react-redux";
import reduce from 'lodash/reduce'
import isString from 'lodash/isString'
import {isActionFirstCompleteSelector, isActionSuccessSelector} from "store/actionStatusReducer";
import Loading from "components/Loading";

export const useIsReady = (actions) => {
  return useSelector(state => {
    return reduce(actions, (isReady, action) => {
        let isActionReady
        if (isString(action)) {
          isActionReady = isActionSuccessSelector(action)(state)
        }
        else {
          const { key, isFirstComplete } = action
          isActionReady = isFirstComplete ? isActionFirstCompleteSelector(key)(state) : isActionSuccessSelector(key)(state)
        }

        return isReady && isActionReady
      }, true
    )
  })
}

const Suspense = ({ actions, withLoader, children }) => {
  const isReady = useIsReady(actions)

  if (isReady) return children
  if (withLoader) return <Loading />
  return null
}

export default Suspense