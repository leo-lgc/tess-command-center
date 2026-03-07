import { AnimatePresence, motion } from 'framer-motion'
import { Braces, X } from 'lucide-react'

const MotionDiv = motion.div

export default function LogPayloadModal({ activeLog, onClose }) {
  return (
    <AnimatePresence>
      {activeLog ? (
        <MotionDiv
          className="payload-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <MotionDiv
            className="payload-modal"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payload-header">
              <h4>
                <Braces size={15} /> Raw event payload
              </h4>
              <button type="button" className="line-action-btn" onClick={onClose} aria-label="Close log payload">
                <X size={13} />
              </button>
            </div>
            <pre>{JSON.stringify(activeLog.payload ?? { line: activeLog.line }, null, 2)}</pre>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  )
}
