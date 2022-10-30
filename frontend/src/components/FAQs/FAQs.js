import React, {useState} from 'react'
import './FAQs.scss'
import {Collapse} from 'react-collapse'
import _ from 'lodash'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";

const FAQS = [
    {
        title: 'the first ever diamond mining experience, from NFT to reality',
        content: () => (
            <p>the first ever diamond mining experience, from NFT to reality</p>
        )
    },
  {
    title: 'the first ever diamond mining experience, from NFT to reality',
    content: () => (
      <p>the first ever diamond mining experience, from NFT to reality</p>
    )
  },
  {
    title: 'the first ever diamond mining experience, from NFT to reality',
    content: () => (
      <p>the first ever diamond mining experience, from NFT to reality</p>
    )
  },
  {
    title: 'the first ever diamond mining experience, from NFT to reality',
    content: () => (
      <p>the first ever diamond mining experience, from NFT to reality</p>
    )
  },
  {
    title: 'the first ever diamond mining experience, from NFT to reality',
    content: () => (
      <p>the first ever diamond mining experience, from NFT to reality</p>
    )
  },
]

const FAQ = ({title, content}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="faq-item">
            <div className="center-aligned-row faq-title" onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={isOpen ? faMinus : faPlus}/>
                {title}
            </div>
            <Collapse isOpened={isOpen}>
                <div>{content()}</div>
            </Collapse>
        </div>
    )
}

const FAQs = () => {
    return (
      <div className="panel faqs">
        <div className="panel-content">
          {_.map(FAQS, faq => <FAQ {...faq}/>)}
        </div>
      </div>
    )
}

export default FAQs