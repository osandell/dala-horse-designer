import { ReactElement, FC } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

// interfaces
import AlertContent from '../../shared/interfaces/AlertProps.interface'

interface AlertDialogProps {
  content: AlertContent
  setContent: (content: AlertContent | null) => void
}

const AlertDialog: FC<AlertDialogProps> = ({
  content,
  setContent,
}): ReactElement => {
  const handleAlternative1 = () => {
    if (content.alternative1Function !== undefined) {
      content.alternative1Function()
    }
    setContent(null)
  }
  const handleAlternative2 = () => {
    if (content.alternative2Function !== undefined) {
      content.alternative2Function()
    }
    setContent(null)
  }

  let dialogContent = null
  if (content.description !== undefined) {
    dialogContent = (
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content.description}
        </DialogContentText>
      </DialogContent>
    )
  }

  return (
    <div>
      <Dialog
        open={true}
        onClose={handleAlternative1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{content.title}</DialogTitle>
        {dialogContent}
        <DialogActions>
          <Button onClick={handleAlternative1} color="primary">
            {content.alternative1}
          </Button>
          {content.alternative2 !== undefined && (
            <Button onClick={handleAlternative2} color="primary" autoFocus>
              {content.alternative2}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AlertDialog
