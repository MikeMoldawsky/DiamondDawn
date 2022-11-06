import React, {useState} from 'react'
import Loading from "components/Loading";
import classNames from "classnames";
import useWindowDimensions from "hooks/useWindowDimensions";

const DEFAULT_MIN_WIDTH = 1025
const SHOW_TEXT_TIME = 100

export const usePageSizeLimit = (minWidth = DEFAULT_MIN_WIDTH) => {
  const { width } = useWindowDimensions()

  return width >= minWidth
}

const PageSizeLimit = ({ minWidth = DEFAULT_MIN_WIDTH, children }) => {
  const showContent = usePageSizeLimit(minWidth)
  const [showText, setShowText] = useState(false)

  setTimeout(() => {
    setShowText(true)
  }, SHOW_TEXT_TIME)

  return showContent ? children : (
    <div className={classNames("center-aligned-column page-cover")}>
      <Loading />
      <div className="leading-text">{showText && "DIAMOND DAWN"}</div>
      <div className="secondary-text">{showText && "Mobile compatibility"}<br/>{showText && " is under construction"}</div>
    </div>
  )
}

export default PageSizeLimit