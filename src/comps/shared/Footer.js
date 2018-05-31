import React from 'react'
import { Link } from 'react-router-dom'

export default () =>
  <div className="m-m m-t-l is-size-6">
    © {(new Date()).getFullYear()} Majorna Team
    · Open Source (MIT)
    · <Link className="button is-small is-outlined" to="/about/terms">Terms & Conditions</Link>
    &nbsp;· <a className="button is-small is-outlined" href="https://github.com/majorna" target="_blank" rel="noopener noreferrer"><i className="fab fa-github m-r-s"/>GitHub</a>
    &nbsp;· <a className="button is-small is-outlined" href="https://www.reddit.com/r/majorna/" target="_blank" rel="noopener noreferrer"><i className="fab fa-reddit m-r-s"/>Reddit</a>
  </div>
