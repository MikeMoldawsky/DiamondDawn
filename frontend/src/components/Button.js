import React from "react"
import classNames from "classnames"
import _ from 'lodash'

const Button = ({className, children, onClick, disabled, ...props}) => {
    const clickHandler = e => !disabled && _.isFunction(onClick) && onClick(e)

    return (
        <div className={classNames("button", className, {disabled})} onClick={clickHandler} {...props}>
            <div className="button-content">{children}</div>
        </div>
    )
}

export default Button