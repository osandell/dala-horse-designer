interface AlertProps {
  title: string
  description?: string
  alternative1?: string
  alternative1Function?: () => void
  alternative2?: string
  alternative2Function?: () => void
}

export default AlertProps
