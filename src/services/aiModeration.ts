// Servizio per la moderazione AI dei contenuti
export interface ModerationResult {
  is_approved: boolean
  confidence: number
  categories: string[]
  reasons: string[]
  suggested_action: 'approve' | 'flag' | 'hide' | 'delete'
}

export interface ContentAnalysis {
  toxicity: number
  spam: number
  inappropriate: number
  hate_speech: number
  violence: number
  nsfw: number
}

// Lista di parole vietate e pattern di spam
const BANNED_WORDS = [
  'spam', 'scam', 'fake', 'hate', 'violence', 'nsfw', 'inappropriate'
]

const SPAM_PATTERNS = [
  /(.)\1{4,}/g, // Caratteri ripetuti
  /[A-Z]{10,}/g, // Troppe maiuscole
  /https?:\/\/[^\s]+/g, // Troppi link
  /@\w+\s*@\w+/g, // Troppe menzioni
]

const HATE_SPEECH_PATTERNS = [
  /(?:kill|die|hate|destroy)\s+(?:yourself|urself|u)/gi,
  /(?:fuck|shit|damn)\s+(?:you|u)/gi,
  /(?:stupid|idiot|moron|dumb)\s+(?:bitch|whore|slut)/gi,
]

// Analizza il contenuto testuale
export const analyzeTextContent = async (content: string): Promise<ContentAnalysis> => {
  const analysis: ContentAnalysis = {
    toxicity: 0,
    spam: 0,
    inappropriate: 0,
    hate_speech: 0,
    violence: 0,
    nsfw: 0
  }

  const lowerContent = content.toLowerCase()

  // Controllo parole vietate
  const bannedWordCount = BANNED_WORDS.filter(word => 
    lowerContent.includes(word.toLowerCase())
  ).length
  analysis.inappropriate += bannedWordCount * 0.2

  // Controllo spam patterns
  let spamScore = 0
  SPAM_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      spamScore += matches.length * 0.1
    }
  })
  analysis.spam = Math.min(spamScore, 1)

  // Controllo hate speech
  let hateScore = 0
  HATE_SPEECH_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      hateScore += matches.length * 0.3
    }
  })
  analysis.hate_speech = Math.min(hateScore, 1)

  // Controllo lunghezza eccessiva (possibile spam)
  if (content.length > 1000) {
    analysis.spam += 0.2
  }

  // Controllo caratteri speciali eccessivi
  const specialCharCount = (content.match(/[!@#$%^&*()_+={}[\]|\\:";'<>?,./]/g) || []).length
  if (specialCharCount > content.length * 0.3) {
    analysis.spam += 0.3
  }

  // Calcolo toxicity generale
  analysis.toxicity = Math.max(
    analysis.inappropriate,
    analysis.hate_speech,
    analysis.spam
  )

  return analysis
}

// Analizza le immagini (mock - in produzione usare servizi come Google Vision API)
export const analyzeImageContent = async (imageUrl: string): Promise<{
  nsfw: number
  violence: number
  inappropriate: number
}> => {
  // Mock analysis - in produzione integrare con servizi AI reali
  return {
    nsfw: Math.random() * 0.1, // Molto basso per test
    violence: Math.random() * 0.05,
    inappropriate: Math.random() * 0.1
  }
}

// Determina l'azione di moderazione
export const determineModerationAction = (analysis: ContentAnalysis): ModerationResult => {
  const { toxicity, spam, inappropriate, hate_speech, violence, nsfw } = analysis

  let isApproved = true
  let confidence = 0
  const categories: string[] = []
  const reasons: string[] = []
  let suggestedAction: 'approve' | 'flag' | 'hide' | 'delete' = 'approve'

  // Controlli di severità
  if (hate_speech > 0.7) {
    isApproved = false
    confidence = hate_speech
    categories.push('hate_speech')
    reasons.push('Contenuto che incita all\'odio')
    suggestedAction = 'delete'
  } else if (hate_speech > 0.4) {
    isApproved = false
    confidence = hate_speech
    categories.push('hate_speech')
    reasons.push('Possibile linguaggio offensivo')
    suggestedAction = 'hide'
  }

  if (nsfw > 0.8) {
    isApproved = false
    confidence = nsfw
    categories.push('nsfw')
    reasons.push('Contenuto inappropriato per minori')
    suggestedAction = 'delete'
  } else if (nsfw > 0.5) {
    isApproved = false
    confidence = nsfw
    categories.push('nsfw')
    reasons.push('Contenuto potenzialmente inappropriato')
    suggestedAction = 'hide'
  }

  if (violence > 0.7) {
    isApproved = false
    confidence = violence
    categories.push('violence')
    reasons.push('Contenuto violento')
    suggestedAction = 'delete'
  } else if (violence > 0.4) {
    isApproved = false
    confidence = violence
    categories.push('violence')
    reasons.push('Possibile contenuto violento')
    suggestedAction = 'hide'
  }

  if (spam > 0.6) {
    isApproved = false
    confidence = spam
    categories.push('spam')
    reasons.push('Possibile spam')
    suggestedAction = 'hide'
  } else if (spam > 0.3) {
    categories.push('spam')
    reasons.push('Contenuto sospetto')
    suggestedAction = 'flag'
  }

  if (inappropriate > 0.5) {
    isApproved = false
    confidence = inappropriate
    categories.push('inappropriate')
    reasons.push('Contenuto inappropriato')
    suggestedAction = 'hide'
  }

  // Calcola confidence generale
  if (confidence === 0) {
    confidence = 1 - toxicity // Più bassa è la toxicity, più alta è la confidence
  }

  return {
    is_approved: isApproved,
    confidence,
    categories,
    reasons,
    suggested_action: suggestedAction
  }
}

// Moderazione completa di un post
export const moderatePost = async (content: string, mediaUrls: string[] = []): Promise<ModerationResult> => {
  try {
    // Analizza il contenuto testuale
    const textAnalysis = await analyzeTextContent(content)
    
    // Analizza le immagini se presenti
    let imageAnalysis = { nsfw: 0, violence: 0, inappropriate: 0 }
    if (mediaUrls.length > 0) {
      for (const imageUrl of mediaUrls) {
        const imgAnalysis = await analyzeImageContent(imageUrl)
        imageAnalysis.nsfw = Math.max(imageAnalysis.nsfw, imgAnalysis.nsfw)
        imageAnalysis.violence = Math.max(imageAnalysis.violence, imgAnalysis.violence)
        imageAnalysis.inappropriate = Math.max(imageAnalysis.inappropriate, imgAnalysis.inappropriate)
      }
    }

    // Combina le analisi
    const combinedAnalysis: ContentAnalysis = {
      toxicity: Math.max(textAnalysis.toxicity, imageAnalysis.inappropriate),
      spam: textAnalysis.spam,
      inappropriate: Math.max(textAnalysis.inappropriate, imageAnalysis.inappropriate),
      hate_speech: textAnalysis.hate_speech,
      violence: Math.max(textAnalysis.violence, imageAnalysis.violence),
      nsfw: Math.max(textAnalysis.nsfw, imageAnalysis.nsfw)
    }

    // Determina l'azione
    return determineModerationAction(combinedAnalysis)
  } catch (error) {
    console.error('Errore nella moderazione AI:', error)
    // In caso di errore, approva il contenuto ma flagga per revisione manuale
    return {
      is_approved: true,
      confidence: 0.5,
      categories: ['error'],
      reasons: ['Errore nell\'analisi automatica'],
      suggested_action: 'flag'
    }
  }
}

// Filtra hashtag e menzioni dal contenuto
export const extractHashtagsAndMentions = (content: string): {
  hashtags: string[]
  mentions: string[]
} => {
  const hashtagRegex = /#(\w+)/g
  const mentionRegex = /@(\w+)/g

  const hashtags = Array.from(content.matchAll(hashtagRegex)).map(match => match[1])
  const mentions = Array.from(content.matchAll(mentionRegex)).map(match => match[1])

  return { hashtags, mentions }
}

// Valida la lunghezza del contenuto
export const validateContentLength = (content: string): {
  isValid: boolean
  remaining: number
  maxLength: number
} => {
  const maxLength = 500 // Limite caratteri per post
  const remaining = maxLength - content.length

  return {
    isValid: remaining >= 0,
    remaining,
    maxLength
  }
}
