import { useState, useRef, useCallback, useEffect } from 'react'

interface WebRTCConfig {
  iceServers: RTCIceServer[]
}

interface UseWebRTCReturn {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  isCallActive: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  startCall: () => Promise<void>
  endCall: () => void
  toggleMute: () => void
  toggleVideo: () => void
  answerCall: () => Promise<void>
  error: string | null
}

const defaultConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}

export const useWebRTC = (config: WebRTCConfig = defaultConfig): UseWebRTCReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  const createPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection(config)
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Invia il candidato ICE all'altro peer
        console.log('ICE candidate:', event.candidate)
      }
    }

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      setRemoteStream(remoteStream)
    }

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState)
      if (peerConnection.connectionState === 'connected') {
        setIsCallActive(true)
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        setIsCallActive(false)
      }
    }

    return peerConnection
  }, [config])

  const startCall = useCallback(async () => {
    try {
      setError(null)
      
      // Richiedi accesso a microfono e camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      setIsVideoEnabled(true)
      setIsMuted(false)

      // Crea la connessione peer
      const peerConnection = createPeerConnection()
      peerConnectionRef.current = peerConnection

      // Aggiungi il stream locale alla connessione
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
      })

      // Crea offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      // Qui dovresti inviare l'offer all'altro peer tramite Supabase Realtime
      console.log('Offer created:', offer)

    } catch (err) {
      console.error('Error starting call:', err)
      setError('Impossibile avviare la chiamata. Controlla i permessi per microfono e camera.')
    }
  }, [createPeerConnection])

  const answerCall = useCallback(async () => {
    try {
      setError(null)
      
      // Richiedi accesso a microfono e camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      setIsVideoEnabled(true)
      setIsMuted(false)

      // Crea la connessione peer
      const peerConnection = createPeerConnection()
      peerConnectionRef.current = peerConnection

      // Aggiungi il stream locale alla connessione
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
      })

      // Qui dovresti ricevere l'offer dall'altro peer e creare la risposta
      console.log('Answering call...')

    } catch (err) {
      console.error('Error answering call:', err)
      setError('Impossibile rispondere alla chiamata.')
    }
  }, [createPeerConnection])

  const endCall = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    setRemoteStream(null)
    setIsCallActive(false)
    setError(null)
  }, [localStream])

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }, [localStream])

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }, [localStream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall()
    }
  }, [endCall])

  return {
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
  }
}
