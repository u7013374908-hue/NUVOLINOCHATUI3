import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Game, GameSession, GameLeaderboard } from '../../types/games'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Gamepad2, Trophy, Users, Clock, X, Play, Crown, Star } from 'lucide-react'

interface GamePanelProps {
  isOpen: boolean
  onClose: () => void
  onStartGame: (gameId: string) => void
  onJoinGame: (sessionId: string) => void
}

const GamePanel: React.FC<GamePanelProps> = ({
  isOpen,
  onClose,
  onStartGame,
  onJoinGame
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'leaderboard' | 'active'>('games')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [leaderboard, setLeaderboard] = useState<GameLeaderboard[]>([])
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([])

  const games: Game[] = [
    {
      id: 'nuvolino-run',
      name: 'Nuvolino Run',
      description: 'Aiuta Nuvolino a correre tra le nuvole evitando gli ostacoli',
      icon: '🏃‍♂️',
      maxPlayers: 1,
      minPlayers: 1,
      estimatedDuration: 60,
      category: 'action',
      isMultiplayer: false,
      rules: [
        'Usa le frecce per saltare',
        'Evita gli ostacoli',
        'Raccogli le stelle per punti bonus',
        'Sopravvivi il più a lungo possibile'
      ]
    },
    {
      id: 'memory-cloud',
      name: 'Memory Cloud',
      description: 'Gioco di memoria con carte di Nuvolino e amici',
      icon: '🧠',
      maxPlayers: 4,
      minPlayers: 2,
      estimatedDuration: 120,
      category: 'puzzle',
      isMultiplayer: true,
      rules: [
        'Trova le coppie di carte uguali',
        'A turno, gira due carte',
        'Se sono uguali, le tieni',
        'Vince chi ha più coppie'
      ]
    },
    {
      id: 'trivia-time',
      name: 'Trivia Time',
      description: 'Quiz veloce su Nuvolino e la community',
      icon: '❓',
      maxPlayers: 8,
      minPlayers: 2,
      estimatedDuration: 180,
      category: 'trivia',
      isMultiplayer: true,
      rules: [
        'Rispondi alle domande il più velocemente possibile',
        'Ogni risposta corretta vale punti',
        'Bonus per risposte consecutive',
        'Vince chi ha più punti alla fine'
      ]
    },
    {
      id: 'tic-tac-toe',
      name: 'Tic-Tac-Toe',
      description: 'Il classico tris con tema Nuvolino',
      icon: '⭕',
      maxPlayers: 2,
      minPlayers: 2,
      estimatedDuration: 60,
      category: 'strategy',
      isMultiplayer: true,
      rules: [
        'Gioca a turni',
        'Metti 3 simboli in fila per vincere',
        'Riga, colonna o diagonale',
        'Se la griglia si riempie, è pareggio'
      ]
    },
    {
      id: 'dice-roll',
      name: 'Dadi e Moneta',
      description: 'Utilità per giochi di ruolo e decisioni casuali',
      icon: '🎲',
      maxPlayers: 10,
      minPlayers: 1,
      estimatedDuration: 30,
      category: 'casual',
      isMultiplayer: true,
      rules: [
        'Lancia dadi virtuali',
        'Lancia monete per decisioni',
        'Perfetto per giochi di ruolo',
        'Risultati condivisi in tempo reale'
      ]
    }
  ]

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      loadLeaderboard()
    } else if (activeTab === 'active') {
      loadActiveSessions()
    }
  }, [activeTab])

  const loadLeaderboard = async () => {
    // Mock data per la leaderboard
    const mockLeaderboard: GameLeaderboard[] = [
      {
        game_id: 'nuvolino-run',
        user_id: 'user1',
        username: 'NuvolinoMaster',
        avatar_url: '/avatars/user1.png',
        score: 15420,
        rank: 1,
        games_played: 45,
        win_rate: 0.89,
        best_score: 15420,
        last_played: new Date().toISOString()
      },
      {
        game_id: 'nuvolino-run',
        user_id: 'user2',
        username: 'CloudRunner',
        avatar_url: '/avatars/user2.png',
        score: 12850,
        rank: 2,
        games_played: 32,
        win_rate: 0.75,
        best_score: 12850,
        last_played: new Date().toISOString()
      },
      {
        game_id: 'nuvolino-run',
        user_id: 'user3',
        username: 'SkyJumper',
        avatar_url: '/avatars/user3.png',
        score: 11200,
        rank: 3,
        games_played: 28,
        win_rate: 0.68,
        best_score: 11200,
        last_played: new Date().toISOString()
      }
    ]
    setLeaderboard(mockLeaderboard)
  }

  const loadActiveSessions = async () => {
    // Mock data per le sessioni attive
    const mockSessions: GameSession[] = [
      {
        id: 'session1',
        game_id: 'memory-cloud',
        players: ['user1', 'user2'],
        game_state: { current_player: 'user1', cards: [] },
        status: 'waiting',
        score: { user1: 0, user2: 0 },
        created_at: new Date().toISOString()
      },
      {
        id: 'session2',
        game_id: 'trivia-time',
        players: ['user3', 'user4', 'user5'],
        game_state: { current_question: 1, answers: {} },
        status: 'active',
        score: { user3: 150, user4: 120, user5: 100 },
        created_at: new Date().toISOString(),
        started_at: new Date().toISOString()
      }
    ]
    setActiveSessions(mockSessions)
  }

  const getGameIcon = (category: string) => {
    const icons = {
      action: '🎮',
      puzzle: '🧩',
      trivia: '❓',
      strategy: '♟️',
      casual: '🎲'
    }
    return icons[category as keyof typeof icons] || '🎮'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Star className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Star className="w-5 h-5 text-orange-500" />
    return <span className="w-5 h-5 text-center text-sm font-bold text-cloud-600">{rank}</span>
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-cloud-200 bg-gradient-to-r from-nuvolino-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-nuvolino-400 to-nuvolino-500 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-nuvolino-700">
                  Sala Giochi
                </h2>
                <p className="text-cloud-600">
                  Divertiti con i mini-giochi di Nuvolino
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'games' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('games')}
            >
              Giochi
            </Button>
            <Button
              variant={activeTab === 'active' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('active')}
            >
              <Users className="w-4 h-4 mr-2" />
              Attive
            </Button>
            <Button
              variant={activeTab === 'leaderboard' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('leaderboard')}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Classifica
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'games' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{game.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-nuvolino-700">
                            {game.name}
                          </h3>
                          <span className="text-sm text-cloud-500">
                            {getGameIcon(game.category)}
                          </span>
                        </div>
                        
                        <p className="text-cloud-600 text-sm mb-3">
                          {game.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-cloud-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{game.minPlayers}-{game.maxPlayers} giocatori</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(game.estimatedDuration / 60)} min</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onStartGame(game.id)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Gioca
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedGame(game)}
                          >
                            Regole
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4">
              {activeSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Gamepad2 className="w-16 h-16 text-cloud-300 mx-auto mb-4" />
                  <p className="text-cloud-500">Nessuna partita attiva</p>
                </div>
              ) : (
                activeSessions.map((session) => {
                  const game = games.find(g => g.id === session.game_id)
                  return (
                    <Card key={session.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{game?.icon}</div>
                          <div>
                            <h4 className="font-semibold text-nuvolino-700">
                              {game?.name}
                            </h4>
                            <p className="text-sm text-cloud-600">
                              {session.players.length} giocatori • {session.status === 'waiting' ? 'In attesa' : 'In corso'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onJoinGame(session.id)}
                        >
                          Unisciti
                        </Button>
                      </div>
                    </Card>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-nuvolino-700">
                  Classifica Nuvolino Run
                </h3>
                <p className="text-cloud-600">I migliori giocatori della settimana</p>
              </div>
              
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <motion.div
                    key={player.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-cloud-50 to-white rounded-xl border border-cloud-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(player.rank)}
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-nuvolino-200 to-nuvolino-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-nuvolino-700">
                          {player.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cloud-800">
                          {player.username}
                        </h4>
                        <p className="text-sm text-cloud-600">
                          {player.games_played} partite • {Math.round(player.win_rate * 100)}% vittorie
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-nuvolino-600">
                        {player.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-cloud-500">
                        Punti migliori
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Game Rules Modal */}
        <AnimatePresence>
          {selectedGame && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-md mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-nuvolino-700">
                    Regole di {selectedGame.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGame(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {selectedGame.rules.map((rule, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-nuvolino-100 text-nuvolino-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-cloud-700">{rule}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedGame(null)}
                    className="flex-1"
                  >
                    Chiudi
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onStartGame(selectedGame.id)
                      setSelectedGame(null)
                    }}
                    className="flex-1"
                  >
                    Gioca Ora
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default GamePanel
