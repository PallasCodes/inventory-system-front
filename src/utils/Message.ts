import { Notify } from 'quasar'

export enum MessageComponent {
  DIALOG = 'dialog',
  TOAST = 'toast',
}

export enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  QUESTION = 'question',
}

const MessageColor = {
  success: '#43A047',
  error: '#D50000',
  warning: '#F18504',
  info: '#757575',
  question: '#3F8A67',
}

const MessageIcon = {
  success: 'check',
  error: 'times',
  warning: 'alert-circle-outline',
  info: 'information-outline',
  question: 'help-circle-outline',
}

interface DestructuredMessageOpts {
  component: MessageComponent
  message: string
  type: MessageType
}

export class Message {
  component: MessageComponent
  type: MessageType
  color: string
  icon: string
  message: string

  constructor(opts: DestructuredMessageOpts) {
    this.component = opts.component
    this.color = MessageColor[opts.type]
    this.icon = MessageIcon[opts.type]
    this.message = opts.message
    this.type = opts.type
  }

  display() {
    Notify.create({
      color: this.color,
      textColor: 'white',
      icon: this.icon,
      message: this.message,
    })
  }
}
