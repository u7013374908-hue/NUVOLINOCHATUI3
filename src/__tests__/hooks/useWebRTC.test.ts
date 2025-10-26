import { renderHook, act } from '@testing-library/react'
import { useWebRTC } from '../../hooks/useWebRTC'

// Mock navigator.mediaDevices
const mockGetUserMedia = jest.fn()
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: mockGetUserMedia,
  },
})

// Mock RTCPeerConnection
const mockPeerConnection = {
  createOffer: jest.fn().mockResolvedValue({}),
  createAnswer: jest.fn().mockResolvedValue({}),
  setLocalDescription: jest.fn().mockResolvedValue({}),
  setRemoteDescription: jest.fn().mockResolvedValue({}),
  addTrack: jest.fn(),
  close: jest.fn(),
  onicecandidate: null,
  ontrack: null,
  onconnectionstatechange: null,
}

global.RTCPeerConnection = jest.fn(() => mockPeerConnection)

describe('useWebRTC', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [
        { kind: 'audio', enabled: true, stop: jest.fn() },
        { kind: 'video', enabled: true, stop: jest.fn() },
      ],
    })
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWebRTC())

    expect(result.current.localStream).toBeNull()
    expect(result.current.remoteStream).toBeNull()
    expect(result.current.isCallActive).toBe(false)
    expect(result.current.isMuted).toBe(false)
    expect(result.current.isVideoEnabled).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should start call successfully', async () => {
    const { result } = renderHook(() => useWebRTC())

    await act(async () => {
      await result.current.startCall()
    })

    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: true,
      audio: true,
    })
    expect(result.current.localStream).toBeTruthy()
    expect(result.current.isVideoEnabled).toBe(true)
    expect(result.current.isMuted).toBe(false)
  })

  it('should handle getUserMedia error', async () => {
    const error = new Error('Permission denied')
    mockGetUserMedia.mockRejectedValue(error)

    const { result } = renderHook(() => useWebRTC())

    await act(async () => {
      await result.current.startCall()
    })

    expect(result.current.error).toBe('Impossibile avviare la chiamata. Controlla i permessi per microfono e camera.')
  })

  it('should toggle mute', async () => {
    const { result } = renderHook(() => useWebRTC())

    await act(async () => {
      await result.current.startCall()
    })

    expect(result.current.isMuted).toBe(false)

    await act(async () => {
      result.current.toggleMute()
    })

    expect(result.current.isMuted).toBe(true)
  })

  it('should toggle video', async () => {
    const { result } = renderHook(() => useWebRTC())

    await act(async () => {
      await result.current.startCall()
    })

    expect(result.current.isVideoEnabled).toBe(true)

    await act(async () => {
      result.current.toggleVideo()
    })

    expect(result.current.isVideoEnabled).toBe(false)
  })

  it('should end call', async () => {
    const { result } = renderHook(() => useWebRTC())

    await act(async () => {
      await result.current.startCall()
    })

    expect(result.current.localStream).toBeTruthy()

    await act(async () => {
      result.current.endCall()
    })

    expect(result.current.localStream).toBeNull()
    expect(result.current.remoteStream).toBeNull()
    expect(result.current.isCallActive).toBe(false)
  })
})
