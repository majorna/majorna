import { library, dom } from '@fortawesome/fontawesome-svg-core'

import {
  faPlusSquare,
  faMinusSquare,
  faQuestionCircle
} from '@fortawesome/free-regular-svg-icons'

import {
  faCreditCard,
  faGlobe,
  faPaperPlane,
  faQrcode,
  faTh,
  faCheck,
  faDollarSign,
  faEuroSign,
  faShoppingCart,
  faSignInAlt,
  faFlask
} from '@fortawesome/free-solid-svg-icons'

import {
  faGithub,
  faReddit,
  faBitcoin,
  faEthereum
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faPlusSquare,
  faMinusSquare,
  faQuestionCircle
)

library.add(
  faCreditCard,
  faGlobe,
  faPaperPlane,
  faQrcode,
  faTh,
  faCheck,
  faDollarSign,
  faEuroSign,
  faShoppingCart,
  faSignInAlt,
  faFlask
)

library.add(
  faGithub,
  faReddit,
  faBitcoin,
  faEthereum
)

dom.watch() // kicks off the process of finding <i> tags and replacing with <svg>
