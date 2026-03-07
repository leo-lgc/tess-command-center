import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const IntroLogoScene = lazy(() => import('./IntroLogoScene'))

const MotionDiv = motion.div
const MotionImg = motion.img

export default function IntroOverlay({ showIntro, hasWebGL, theme, logoSrc, introTilt, onMouseMove }) {
  return (
    <AnimatePresence>
      {showIntro ? (
        <MotionDiv
          className="intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onMouseMove={onMouseMove}
        >
          {hasWebGL ? (
            <div className="intro-canvas-wrap">
              <Suspense fallback={null}>
                <IntroLogoScene theme={theme} />
              </Suspense>
            </div>
          ) : null}

          <MotionDiv
            className="intro-logo-shell"
            initial={{ opacity: 0, scale: 0.93, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -6 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              transform: `perspective(900px) rotateX(${introTilt.x}deg) rotateY(${introTilt.y}deg)`,
            }}
          >
            <MotionImg
              src={logoSrc}
              alt="TESS"
              className="intro-logo"
              initial={{ opacity: 0, filter: 'blur(7px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.18, duration: 0.48 }}
            />
            <p className="intro-caption">Command Center</p>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  )
}
