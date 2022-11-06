import React, {useState} from 'react'
import Loading from "components/Loading";
import classNames from "classnames";
import useWindowDimensions from "hooks/useWindowDimensions";

const DEFAULT_MIN_WIDTH = 1025
const SHOW_TEXT_TIME = 100

const PageSizeLimit = ({ minWidth = DEFAULT_MIN_WIDTH, children }) => {
  const { width } = useWindowDimensions()
  const [showText, setShowText] = useState(false)

  setTimeout(() => {
    setShowText(true)
  }, SHOW_TEXT_TIME)

  return width >= minWidth ? children : (
    <div className={classNames("center-aligned-column page-loader")}>
      <Loading />
      <div className="secondary-text">{showText && "Mobile compatibility"}<br/>{showText && "under construction"}</div>
    </div>
  )
}

export default PageSizeLimit