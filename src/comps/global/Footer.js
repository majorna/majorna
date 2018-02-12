import React from 'react'

export default () => (
  <div className="m-m is-size-6">
    © {(new Date()).getFullYear()} Majorna Team
    · Open Source (MIT)
    · <a className="button is-small is-outlined" href="https://github.com/majorna" target="_blank" rel="noopener noreferrer">View on GitHub</a>
    &nbsp;· <a className="button is-small is-outlined" href="https://www.reddit.com/r/majorna/" target="_blank" rel="noopener noreferrer">Reddit</a>
  </div>
)