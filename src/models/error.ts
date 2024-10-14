class ErrorWithStatus {
  status: number
  message: string
  errors?: any
  constructor({ status, message, errors }: { status: number; message: string; errors?: any }) {
    this.status = status
    this.message = message
    errors && (this.errors = errors)
  }
}

export default ErrorWithStatus
