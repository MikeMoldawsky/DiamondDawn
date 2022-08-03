import React from 'react'
import classNames from "classnames";
import {ReactSVG} from "react-svg";

export default ({src, className, ...props}) => (
    <ReactSVG src={src} wrapper="span" className={classNames('icon', className)} {...props}/>
)