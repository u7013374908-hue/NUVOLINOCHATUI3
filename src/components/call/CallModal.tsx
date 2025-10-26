import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebRTC } from '../../hooks/useWebRTC'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Phone, Video, Mic, MicOff, VideoOff, X, PhoneOff } from 'lucide-react'

interface CallModalProps {
  isOpen: boolean
  onClose: () => void
  callType: 'audio' | 'video'
  isIncoming?: boolean
  callerName?: string
}

const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  callType,
  isIncoming = false,
  callerName = 'Chiamante'
}) => {
  const {
    localStream,
    remoteStream,
    isCallActive,
    isMuted,
    isVideoEnabled,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    answerCall,
    error
  } = useWebRTC()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const handleAnswer = async () => {
    await answerCall()
  }

  const handleStartCall = async () => {
    await startCall()
  }

  const handleEndCall = () => {
    endCall()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-4xl mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card variant="glass" className="backdrop-blur-xl p-0 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-nuvolino-400 to-nuvolino-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      {callType === 'audio' ? (
                        <Phone className="w-6 h-6" />
                      ) : (
                        <Video className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {isIncoming ? `Chiamata in arrivo da ${callerName}` : 'Chiamata in corso'}
                      </h3>
                      <p className="text-sm opacity-90">
                        {callType === 'audio' ? 'Chiamata vocale' : 'Chiamata video'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Video Area */}
              {callType === 'video' && (
                <div className="relative h-96 bg-gradient-to-br from-cloud-100 to-cloud-200">
                  {/* Remote Video */}
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Local Video */}
                  {localStream && (
                    <div className="absolute top-4 right-4 w-32 h-24 bg-cloud-800 rounded-lg overflow-hidden shadow-lg">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Status Overlay */}
                  {!isCallActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                          {isIncoming ? (
                            <Phone className="w-8 h-8" />
                          ) : (
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                        <p className="text-lg font-medium">
                          {isIncoming ? 'Chiamata in arrivo...' : 'Connessione in corso...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Audio Only Area */}
              {callType === 'audio' && (
                <div className="h-64 bg-gradient-to-br from-nuvolino-100 to-nuvolino-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/30 rounded-full flex items-center justify-center">
                      <Phone className="w-12 h-12 text-nuvolino-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-nuvolino-700 mb-2">
                      {isIncoming ? `Chiamata da ${callerName}` : 'Chiamata in corso'}
                    </h4>
                    <p className="text-cloud-600">
                      {isCallActive ? 'Connesso' : 'Connessione in corso...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="p-6 bg-white/10">
                {error && (
                  <motion.div
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex items-center justify-center space-x-4">
                  {/* Answer/Start Call Button */}
                  {isIncoming && !isCallActive ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAnswer}
                      className="w-16 h-16 rounded-full"
                    >
                      <Phone className="w-6 h-6" />
                    </Button>
                  ) : !isCallActive ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStartCall}
                      className="w-16 h-16 rounded-full"
                    >
                      <Phone className="w-6 h-6" />
                    </Button>
                  ) : null}

                  {/* Mute Button */}
                  {isCallActive && (
                    <Button
                      variant={isMuted ? 'secondary' : 'ghost'}
                      size="lg"
                      onClick={toggleMute}
                      className="w-12 h-12 rounded-full"
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>
                  )}

                  {/* Video Toggle Button */}
                  {isCallActive && callType === 'video' && (
                    <Button
                      variant={!isVideoEnabled ? 'secondary' : 'ghost'}
                      size="lg"
                      onClick={toggleVideo}
                      className="w-12 h-12 rounded-full"
                    >
                      {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                  )}

                  {/* End Call Button */}
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleEndCall}
                    className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CallModal
