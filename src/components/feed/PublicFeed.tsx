import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PublicPost, PostComment, FeedFilter } from '../../types/feed'
import { moderatePost, extractHashtagsAndMentions, validateContentLength } from '../../services/aiModeration'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Image, Hash, TrendingUp, Users, Star, Flag, Eye, EyeOff } from 'lucide-react'

interface PublicFeedProps {
  isOpen: boolean
  onClose: () => void
  currentUser: any
}

const PublicFeed: React.FC<PublicFeedProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [posts, setPosts] = useState<PublicPost[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<FeedFilter>({ type: 'all' })
  const [newPost, setNewPost] = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PublicPost | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<PostComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([])

  // Mock data per il feed
  useEffect(() => {
    const mockPosts: PublicPost[] = [
      {
        id: '1',
        author_id: 'user1',
        content: 'Ciao a tutti! Sono nuovo nella Nuvola e sono già innamorato di Nuvolino! 🐶☁️ #nuvolino #benvenuto',
        media_urls: [],
        likes_count: 24,
        comments_count: 8,
        shares_count: 3,
        is_pinned: false,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
          id: 'user1',
          username: 'nuvolino_fan_2024',
          avatar_url: '/avatars/user1.png',
          display_name: 'Nuvolino Fan',
          is_verified: false,
          level: 5,
          badges: ['🐾']
        },
        hashtags: ['nuvolino', 'benvenuto'],
        is_liked: false,
        is_shared: false
      },
      {
        id: '2',
        author_id: 'user2',
        content: 'Ho appena vinto la mia prima partita di Memory Cloud! 🧠🎉 Grazie a tutti per aver giocato con me! #gaming #memorycloud #nuvolino',
        media_urls: ['/images/memory-win.png'],
        likes_count: 42,
        comments_count: 15,
        shares_count: 7,
        is_pinned: false,
        is_verified: true,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        author: {
          id: 'user2',
          username: 'gamer_pro',
          avatar_url: '/avatars/user2.png',
          display_name: 'Gamer Pro',
          is_verified: true,
          level: 25,
          badges: ['🏆', '🎮', '⭐']
        },
        hashtags: ['gaming', 'memorycloud', 'nuvolino'],
        is_liked: true,
        is_shared: false
      },
      {
        id: '3',
        author_id: 'user3',
        content: 'Nuvolino è il cagnolino più dolce del mondo! Guardate come dorme nella sua nuvola! 😴☁️ #nuvolino #cute #sleeping',
        media_urls: ['/images/nuvolino-sleeping.gif'],
        likes_count: 156,
        comments_count: 32,
        shares_count: 28,
        is_pinned: true,
        is_verified: true,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date(Date.now() - 7200000).toISOString(),
        author: {
          id: 'user3',
          username: 'nuvolino_official',
          avatar_url: '/avatars/nuvolino.png',
          display_name: 'Nuvolino Ufficiale',
          is_verified: true,
          level: 100,
          badges: ['👑', '🌟', '🏆', '⭐']
        },
        hashtags: ['nuvolino', 'cute', 'sleeping'],
        is_liked: false,
        is_shared: true
      }
    ]

    setPosts(mockPosts)
    setTrendingHashtags(['nuvolino', 'gaming', 'cute', 'memorycloud', 'benvenuto'])
  }, [])

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    // Valida la lunghezza
    const validation = validateContentLength(newPost)
    if (!validation.isValid) {
      alert(`Il post è troppo lungo! Rimangono ${validation.remaining} caratteri.`)
      return
    }

    // Estrai hashtag e menzioni
    const { hashtags, mentions } = extractHashtagsAndMentions(newPost)

    // Moderazione AI
    const moderation = await moderatePost(newPost, [])
    if (!moderation.is_approved) {
      alert(`Post non approvato: ${moderation.reasons.join(', ')}`)
      return
    }

    // Crea il nuovo post
    const post: PublicPost = {
      id: Date.now().toString(),
      author_id: currentUser.id,
      content: newPost,
      media_urls: [],
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      is_pinned: false,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        avatar_url: currentUser.avatar_url,
        display_name: currentUser.display_name || currentUser.username,
        is_verified: false,
        level: currentUser.level || 1,
        badges: currentUser.badges || []
      },
      hashtags,
      mentions,
      is_liked: false,
      is_shared: false
    }

    setPosts(prev => [post, ...prev])
    setNewPost('')
    setShowCompose(false)
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked: !post.is_liked,
            likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
          }
        : post
    ))
  }

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_shared: !post.is_shared,
            shares_count: post.is_shared ? post.shares_count - 1 : post.shares_count + 1
          }
        : post
    ))
  }

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return

    const comment: PostComment = {
      id: Date.now().toString(),
      post_id: postId,
      author_id: currentUser.id,
      content: newComment,
      likes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: currentUser.id,
        username: currentUser.username,
        avatar_url: currentUser.avatar_url,
        display_name: currentUser.display_name || currentUser.username,
        is_verified: false
      },
      is_liked: false
    }

    setComments(prev => [...prev, comment])
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments_count: post.comments_count + 1 }
        : post
    ))
    setNewComment('')
  }

  const filteredPosts = posts.filter(post => {
    switch (filter.type) {
      case 'following':
        // Mock: mostra solo post di utenti seguiti
        return true
      case 'trending':
        return post.likes_count > 20 || post.shares_count > 5
      case 'verified':
        return post.author?.is_verified
      case 'all':
      default:
        return true
    }
  })

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
                <Hash className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-nuvolino-700">
                  Nuvola Pubblica
                </h2>
                <p className="text-cloud-600">
                  Condividi con la community di Nuvolino
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Filtri */}
          <div className="flex space-x-2">
            {[
              { type: 'all', label: 'Tutti', icon: Hash },
              { type: 'following', label: 'Seguiti', icon: Users },
              { type: 'trending', label: 'Trending', icon: TrendingUp },
              { type: 'verified', label: 'Verificati', icon: Star }
            ].map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant={filter.type === type ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter({ type: type as any })}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex h-96">
          {/* Sidebar Trending */}
          <div className="w-64 bg-cloud-50 p-4 border-r border-cloud-200">
            <h3 className="font-semibold text-cloud-700 mb-4">Trending</h3>
            <div className="space-y-2">
              {trendingHashtags.map((hashtag, index) => (
                <button
                  key={hashtag}
                  className="w-full text-left p-2 rounded-lg hover:bg-cloud-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-nuvolino-600 font-medium">#{hashtag}</span>
                    <span className="text-xs text-cloud-500">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Feed */}
          <div className="flex-1 overflow-y-auto">
            {/* Compose Post */}
            <div className="p-4 border-b border-cloud-200">
              <div className="flex items-start space-x-3">
                <Avatar
                  src={currentUser?.avatar_url}
                  alt={currentUser?.username}
                  size="sm"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Cosa sta succedendo nella Nuvola?"
                    className="w-full p-3 border border-cloud-200 rounded-xl resize-none focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Image className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-cloud-500">
                        {newPost.length}/500
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Pubblica
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4 p-4">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={post.author?.avatar_url}
                        alt={post.author?.username}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-cloud-800">
                            {post.author?.display_name}
                          </span>
                          <span className="text-cloud-500 text-sm">
                            @{post.author?.username}
                          </span>
                          {post.author?.is_verified && (
                            <Star className="w-4 h-4 text-blue-500 fill-current" />
                          )}
                          <span className="text-xs text-cloud-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          {post.is_pinned && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              📌 In evidenza
                            </span>
                          )}
                        </div>

                        <p className="text-cloud-800 mb-3 whitespace-pre-wrap">
                          {post.content}
                        </p>

                        {post.media_urls.length > 0 && (
                          <div className="mb-3">
                            <img
                              src={post.media_urls[0]}
                              alt="Post media"
                              className="max-w-xs rounded-lg"
                            />
                          </div>
                        )}

                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.hashtags.map(hashtag => (
                              <span
                                key={hashtag}
                                className="text-nuvolino-600 bg-nuvolino-100 px-2 py-1 rounded-full text-xs"
                              >
                                #{hashtag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1 ${
                              post.is_liked ? 'text-red-500' : 'text-cloud-500 hover:text-red-500'
                            } transition-colors`}
                          >
                            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.likes_count}</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPost(post)
                              setShowComments(true)
                            }}
                            className="flex items-center space-x-1 text-cloud-500 hover:text-nuvolino-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.comments_count}</span>
                          </button>

                          <button
                            onClick={() => handleShare(post.id)}
                            className={`flex items-center space-x-1 ${
                              post.is_shared ? 'text-green-500' : 'text-cloud-500 hover:text-green-500'
                            } transition-colors`}
                          >
                            <Share2 className={`w-4 h-4 ${post.is_shared ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.shares_count}</span>
                          </button>

                          <button className="flex items-center space-x-1 text-cloud-500 hover:text-red-500 transition-colors">
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments Modal */}
        <AnimatePresence>
          {showComments && selectedPost && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-4 border-b border-cloud-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-nuvolino-700">
                      Commenti
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(false)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <Avatar
                        src={comment.author?.avatar_url}
                        alt={comment.author?.username}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-cloud-800 text-sm">
                            {comment.author?.display_name}
                          </span>
                          <span className="text-cloud-500 text-xs">
                            @{comment.author?.username}
                          </span>
                          <span className="text-xs text-cloud-500">
                            {new Date(comment.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-cloud-700 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-cloud-200">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={currentUser?.avatar_url}
                      alt={currentUser?.username}
                      size="sm"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Scrivi un commento..."
                        className="w-full p-2 border border-cloud-200 rounded-lg focus:border-nuvolino-400 focus:ring-2 focus:ring-nuvolino-100"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(selectedPost.id)}
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleComment(selectedPost.id)}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default PublicFeed
